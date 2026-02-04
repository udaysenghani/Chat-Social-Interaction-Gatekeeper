import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();

    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }
    const authHeader =
      client.handshake.headers?.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'Missing authorization header',
      );
    }
    const token = authHeader.replace('Bearer ', '');
    console.log(token);
    try {
      const payload = this.jwtService.verify(token);
      
      // ✅ OFFICIAL SOCKET.IO STORAGE
      client.data.user = {
        sub: payload.sub,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
