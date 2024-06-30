import {
  Get,
  Req,
  Post,
  Body,
  Param,
  Patch,
  Controller,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { LoginPayloadDto } from './dto/login.dto';
import { RegisterPayloadDto } from './dto/register.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/check-username-availability')
  checkUsernameAvailability(@Body() { username }: { username: string }) {
    return this.authService.checkUsernameAvailability(username);
  }

  @Post('/check-email-availability')
  checkEmailAvailability(@Body() { email }: { email: string }) {
    return this.authService.checkEmailAvailability(email);
  }

  @Post()
  register(@Body(ValidationPipe) registerPayloadDto: RegisterPayloadDto) {
    return this.authService.register(registerPayloadDto);
  }

  @Post('/login')
  login(@Body(ValidationPipe) loginPayloadDto: LoginPayloadDto) {
    return this.authService.login(loginPayloadDto);
  }

  @Patch('/verify/:token')
  verify(@Param('token') token: string) {
    return this.authService.verify(token);
  }

  @Get('/resend')
  @UseGuards(JwtAuthGuard)
  resendEmailVerificationToken(@Req() req: Request) {
    return this.authService.resendEmailVerificationToken(req.user);
  }
}
