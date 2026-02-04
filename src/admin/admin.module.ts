import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MaliciousActivityModule } from '../malicious-activity/malicious-activity.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MaliciousActivityModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
