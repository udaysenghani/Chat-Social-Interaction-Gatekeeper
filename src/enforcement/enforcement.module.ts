import { Module } from '@nestjs/common';
import { EnforcementService } from './enforcement.service';
import { MessagesModule } from '../messages/messages.module';
import { MaliciousActivityModule } from '../malicious-activity/malicious-activity.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MessagesModule,
    MaliciousActivityModule,
    UsersModule,
  ],
  providers: [EnforcementService],
  exports: [EnforcementService],
})
export class EnforcementModule {}
