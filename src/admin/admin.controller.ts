import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('malicious-logs')
  @ApiOperation({ summary: 'View all malicious activity with context' })
  async getMaliciousLogs() {
    return this.adminService.getAllMaliciousLogs();
  }

  @Post('block/:userId')
  @ApiOperation({ summary: 'Block a user' })
  async blockUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    await this.adminService.blockUser(userId);
    return { message: 'User blocked successfully' };
  }

  @Post('unblock/:userId')
  @ApiOperation({ summary: 'Unblock a user' })
  async unblockUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    await this.adminService.unblockUser(userId);
    return { message: 'User unblocked successfully' };
  }
}
