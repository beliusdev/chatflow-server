import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async emailVerification(user: User, token: string) {
    const url = `
    Click on the link below to verify your email address.

    
    ${process.env.CLIENT_URL}/verification/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome ${user.displayName}`, // todo
      text: url,
      context: {
        name: user.displayName,
        url,
      },
    });
  }
}
