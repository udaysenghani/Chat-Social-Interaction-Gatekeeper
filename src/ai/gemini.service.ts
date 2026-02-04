import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiResponseDto } from './dto/ai-response.dto';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  /**
   * ✅ Use supported, fast, moderation-friendly model
   */
  private readonly GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';


  async classifyBatch(
    messages: AiRequestDto[],
  ): Promise<AiResponseDto[]> {
    if (!messages || messages.length === 0) {
      return [];
    }

    const prompt = this.buildPrompt(messages);

    try {
      const response = await axios.post(
        this.GEMINI_URL,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          timeout: 8000,
          params: {
            key: process.env.GEMINI_API_KEY, // ✅ secure
          },
        },
      );

      return this.parseResponse(response.data, messages);
    } catch (error) {
      this.logger.error(
        'Gemini API call failed',
        error instanceof Error ? error.message : error,
      );
      return this.failSafe(messages);
    }
  }

  /**
   * 🔑 Prompt engineering (critical for correctness)
   */
  private buildPrompt(messages: AiRequestDto[]): string {
    return `
You are a security moderation AI.

Analyze each message and decide if it is malicious.

Malicious categories:
- Phishing
- Scam
- Toxicity
- Harassment
- Hate Speech

Rules:
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include extra text

Response format:
[
  {
    "message_id": "uuid",
    "is_malicious": true|false,
    "incident_type": "Phishing | Scam | Toxicity | Harassment | Hate Speech | None",
    "confidence": 0.0-1.0
  }
]

Messages:
${messages
  .map(
    (m) =>
      `- message_id: ${m.message_id}, text: "${m.text}"`,
  )
  .join('\n')}
`;
  }

  /**
   * 🧠 Parse & normalize Gemini output (HARDENED)
   */
  private parseResponse(
    data: any,
    messages: AiRequestDto[],
  ): AiResponseDto[] {
    try {
      const rawText: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty Gemini response');
      }

      /**
       * Gemini may return extra whitespace or text.
       * Extract JSON safely.
       */
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('JSON array not found in response');
      }

      const jsonString = rawText.slice(
        jsonStart,
        jsonEnd + 1,
      );

      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new Error('Parsed response is not an array');
      }

      return parsed.map((item) => ({
        message_id: item.message_id,
        is_malicious: Boolean(item.is_malicious),
        incident_type:
          item.incident_type && item.is_malicious
            ? item.incident_type
            : 'None',
        confidence: Math.min(
          Math.max(Number(item.confidence ?? 0.5), 0),
          1,
        ),
      }));
    } catch (err) {
      this.logger.error(
        'Failed to parse Gemini response',
        err instanceof Error ? err.message : err,
      );
      return this.failSafe(messages);
    }
  }

  /**
   * 🛡️ Fail-safe logic
   * If AI is unavailable, system must continue safely.
   */
  private failSafe(
    messages: AiRequestDto[],
  ): AiResponseDto[] {
    return messages.map((m) => ({
      message_id: m.message_id,
      is_malicious: false,
      incident_type: 'None',
      confidence: 0.0,
    }));
  }
}
