import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { UpdatePayloadDto } from './dto/update.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req: Request) {
    return this.userService.getCurrentUser(req.user);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Req() req: Request, @Query('identifier') identifier: string) {
    return this.userService.searchUsers(req.user, identifier);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateCurrentUser(
    @Req() req: Request,
    @Body(ValidationPipe) updatePayloadDto: UpdatePayloadDto,
  ) {
    return this.userService.updateCurrentUser(req.user, updatePayloadDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() req: Request,
    @Body() { password, newPassword }: ChangePasswordDto,
  ) {
    return this.userService.changePassword(req, password, newPassword);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteCurrentUser(@Req() req: Request, @Body('password') password: string) {
    return this.userService.deleteCurrentUser(req.user, password);
  }
}
