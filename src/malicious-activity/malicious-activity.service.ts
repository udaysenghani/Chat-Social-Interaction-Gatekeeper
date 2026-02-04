import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaliciousActivity } from './malicious-activity.entity';

@Injectable()
export class MaliciousActivityService {
  constructor(
    @InjectRepository(MaliciousActivity)
    private readonly maliciousRepo: Repository<MaliciousActivity>,
  ) {}

  async logIncident(
    messageId: string,
    userId: string,
    incidentType: string,
    confidence: number,
  ): Promise<MaliciousActivity> {
    const incident = this.maliciousRepo.create({
      message_id: messageId,
      user_id: userId,
      incident_type: incidentType,
      confidence,
    });

    return this.maliciousRepo.save(incident);
  }

  async findAllWithContext(): Promise<MaliciousActivity[]> {
    return this.maliciousRepo.find({
      relations: ['message', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<MaliciousActivity[]> {
    return this.maliciousRepo.find({
      where: { user_id: userId },
      relations: ['message'],
      order: { created_at: 'DESC' },
    });
  }
}
