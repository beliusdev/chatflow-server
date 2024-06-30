import { Request } from 'express';
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/:secondUserId')
  @UseGuards(JwtAuthGuard)
  createChat(@Req() req: Request, @Param('secondUserId') secondUserId: string) {
    return this.chatService.createChat(req.user, +secondUserId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  findUserChats(@Req() req: Request) {
    return this.chatService.findUserChats(req.user);
  }

  @Get('/:chatId')
  @UseGuards(JwtAuthGuard)
  findChat(@Req() req: Request, @Param('chatId') chatId: string) {
    return this.chatService.findChat(req.user, +chatId);
  }
}
