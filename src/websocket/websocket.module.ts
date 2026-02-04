import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { BatchModule } from '../batch/batch.module';
import { AiModule } from '../ai/ai.module';
import { EnforcementModule } from '../enforcement/enforcement.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MessagesModule,
    BatchModule,
  ],
  providers: [ChatGateway],
})
export class WebsocketModule {}
