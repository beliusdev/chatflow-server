import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePayloadDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
