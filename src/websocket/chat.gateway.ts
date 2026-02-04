import {
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { MessagesService } from 'src/messages/messages.service';
import { BatchService } from 'src/batch/batch.service'; // 👉 treat as QUEUE PRODUCER

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly batchService: BatchService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 🔐 AUTHENTICATE SOCKET (HANDSHAKE)
   */
  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Invalid Authorization header');
      }

      const token = authHeader.substring(7);

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = {
        sub: payload.sub,
        role: payload.role,
      };

      // user-specific room (for future pub/sub)
      client.join(`user_${payload.sub}`);

      this.logger.log(`User ${payload.sub} connected`);
    } catch (error) {
      this.logger.error(
        'WebSocket authentication failed',
        error.message,
      );
      client.disconnect(true);
    }
  }

  /**
   * 🔌 DISCONNECT
   */
  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user?.sub) {
      this.logger.log(`User ${user.sub} disconnected`);
    }
  }

  /**
   * 💬 USER SENDS MESSAGE
   * EVENT: message:send
   */
  @SubscribeMessage('message:send')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async handleMessageSend(
    @MessageBody()
    body: {
      text: string;
      client_message_id: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user?.sub) {
      client.disconnect(true);
      return;
    }

    if (!body.text || body.text.trim().length === 0) {
      client.emit('message:error', {
        client_message_id: body.client_message_id,
        error: 'EMPTY_MESSAGE',
      });
      return;
    }

    // 1️⃣ Persist message (SOURCE OF TRUTH)
    const message = await this.messagesService.createMessage(
      user.sub,
      body.text
    );

    // 2️⃣ Enqueue to queue (Redis/BullMQ in production)
    await this.batchService.enqueue({
      message_id: message.id,
      user_id: user.sub,
      text: message.text,
    });

    // 3️⃣ ACK immediately (critical for UX)
    client.emit('message:ack', {
      client_message_id: body.client_message_id,
      message_id: message.id,
      status: 'received',
    });
  }
}
