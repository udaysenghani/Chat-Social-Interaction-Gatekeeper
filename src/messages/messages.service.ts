import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageStatus } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    userId: string,
    text: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      user_id: userId,
      text,
      status: MessageStatus.PENDING,
    });

    return this.messageRepository.save(message);
  }

  async updateStatus(
    messageId: string,
    status: MessageStatus,
  ): Promise<void> {
    await this.messageRepository.update(messageId, { status });
  }

  async findById(messageId: string): Promise<Message | null> {
    return this.messageRepository.findOne({
      where: { id: messageId },
    });
  }

  async findByUser(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
