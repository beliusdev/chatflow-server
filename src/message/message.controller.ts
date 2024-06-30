import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  createMessage(@Body(ValidationPipe) body: CreateMessageDto) {
    return this.messageService.createMessage(body);
  }

  @Get('/:chatId')
  @UseGuards(JwtAuthGuard)
  getMessages(@Req() req: Request, @Param('chatId') chatId: string) {
    return this.messageService.getMessages(req.user, +chatId);
  }
}
