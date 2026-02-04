import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { BatchService } from '../batch/batch.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    MessagesModule, // ✅ IMPORT THE MODULE, NOT THE SERVICE
  ],
  providers: [
    ChatGateway,
    BatchService,
  ],
})
export class ChatModule {}
