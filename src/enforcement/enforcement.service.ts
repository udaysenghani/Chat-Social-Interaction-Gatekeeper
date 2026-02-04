/*
Message status is updated
Malicious activity is written
Blocking decisions are made
WebSocket disconnect signals originate
No other module is allowed to do these directly.
 */
import { Injectable, Logger } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { MaliciousActivityService } from '../malicious-activity/malicious-activity.service';
import { UsersService } from '../users/users.service';
import { MessageStatus } from '../messages/message.entity';

interface EnforcementInput {
  message_id: string;
  user_id: string;
  is_malicious: boolean;
  incident_type?: string;
  confidence: number;
}

@Injectable()
export class EnforcementService {
  private readonly logger = new Logger(EnforcementService.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly maliciousService: MaliciousActivityService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Apply AI verdict to system state
   */
  async applyVerdict(input: EnforcementInput): Promise<void> {
    const {
      message_id,
      user_id,
      is_malicious,
      incident_type,
      confidence,
    } = input;

    if (!is_malicious) {
      await this.messagesService.updateStatus(
        message_id,
        MessageStatus.SAFE,
      );
      return;
    }

    // 🚨 Malicious message
    await this.messagesService.updateStatus(
      message_id,
      MessageStatus.MALICIOUS,
    );

    await this.maliciousService.logIncident(
      message_id,
      user_id,
      incident_type ?? 'Unknown',
      confidence,
    );

    this.logger.warn(
      `User ${user_id} send a malicious message ${message_id}`,
    );
  }
}

