export class AiResponseDto {
  message_id: string;
  is_malicious: boolean;
  incident_type?: string;
  confidence: number;
}
