import { Injectable } from '@nestjs/common';
import { MaliciousActivityService } from '../malicious-activity/malicious-activity.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly maliciousService: MaliciousActivityService,
    private readonly usersService: UsersService,
  ) {}

  async getAllMaliciousLogs() {
    return this.maliciousService.findAllWithContext();
  }

  async blockUser(userId: string): Promise<void> {
    await this.usersService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    await this.usersService.unblockUser(userId);
  }
}
