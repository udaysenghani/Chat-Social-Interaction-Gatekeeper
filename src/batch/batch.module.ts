import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { AiModule } from 'src/ai/ai.module';
import { EnforcementModule } from 'src/enforcement/enforcement.module';

@Module({
  imports:[AiModule,EnforcementModule],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
