import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { GeminiService } from 'src/ai/gemini.service';
import { EnforcementService } from 'src/enforcement/enforcement.service';

interface BatchItem {
  message_id: string;
  user_id: string;
  text: string;
}

@Injectable()
export class BatchService implements OnModuleInit {
  private readonly logger = new Logger(BatchService.name);

  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL_MS = 10000;

  private buffer: BatchItem[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor(
    private readonly geminiService: GeminiService,
    private readonly enforcementService: EnforcementService,
  ) {}

  onModuleInit() {
    this.startFlushTimer();
  }

  /**
   * Called from hot paths (WebSocket, API, etc.)
   * Must be NON-BLOCKING
   */
  enqueue(item: BatchItem): void {
    this.buffer.push(item);

    if (this.buffer.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  /**
   * Timer-based flushing
   */
  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.FLUSH_INTERVAL_MS);
  }

  /**
   * Flushes the buffer asynchronously
   */
  private async flush() {
    if (this.isFlushing) return;

    this.isFlushing = true;

    // Copy buffer and clear immediately
    const batch = [...this.buffer];
    this.buffer = [];

    try {
      await this.processBatch(batch);
    } catch (err) {
      this.logger.error(
        'Batch processing failed',
        err instanceof Error ? err.stack : err,
      );
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * ✅ PHASE 9 — COMPLETE IMPLEMENTATION
   *
   * Flow:
   * 1. Send batch to Gemini
   * 2. Receive verdicts
   * 3. Apply enforcement for each message
   */
  protected async processBatch(
    batch: BatchItem[],
  ): Promise<void> {
    this.logger.log(
      `Sending batch of ${batch.length} messages to Gemini`,
    );

    /**
     * Step 1️⃣ — Call Gemini AI
     */
    const aiResults =
      await this.geminiService.classifyBatch(
        batch.map((item) => ({
          message_id: item.message_id,
          user_id: item.user_id,
          text: item.text,
        })),
      );

    if (!aiResults || aiResults.length === 0) {
      this.logger.warn(
        'Gemini returned empty result set',
      );
      return;
    }

    /**
     * Step 2️⃣ — Apply enforcement per message
     */
    for (const result of aiResults) {
      await this.enforcementService.applyVerdict({
        message_id: result.message_id,
        user_id: batch.find(
          (b) => b.message_id === result.message_id,
        )?.user_id!,
        is_malicious: result.is_malicious,
        incident_type: result.incident_type,
        confidence: result.confidence,
      });
    }

    this.logger.log(
      `Batch of ${batch.length} messages processed successfully`,
    );
  }
}
