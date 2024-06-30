import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  password: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
