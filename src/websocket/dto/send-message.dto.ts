import { IsString, IsUUID, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  text: string;

  @IsUUID()
  client_message_id: string;
}
