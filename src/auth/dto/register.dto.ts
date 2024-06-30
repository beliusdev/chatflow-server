import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterPayloadDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
