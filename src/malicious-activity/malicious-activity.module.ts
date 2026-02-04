import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaliciousActivity } from './malicious-activity.entity';
import { MaliciousActivityService } from './malicious-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaliciousActivity])],
  providers: [MaliciousActivityService],
  exports: [MaliciousActivityService],
})
export class MaliciousActivityModule {}
