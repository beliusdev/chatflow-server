import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { UserService } from './user/user.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    MailModule,
    MessageModule,
  ],
  controllers: [AppController, UserController, AuthController, ChatController],
  providers: [
    AppService,
    DatabaseService,
    AuthService,
    UserService,
    MailService,
    JwtService,
    ChatService,
  ],
})
export class AppModule {}
