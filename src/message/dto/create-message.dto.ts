import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNumber()
  @IsNotEmpty()
  recipientId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
