import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMessage({ chatId, senderId, recipientId, text }) {
    const message = this.databaseService.message.create({
      data: {
        recipientId,
        senderId,
        chatId,
        text,
      },
    });

    return message;
  }

  async getMessages(userJwt: any, chatId: number) {
    const messages = await this.databaseService.message.findMany({
      where: {
        AND: [
          { chatId },
          { OR: [{ senderId: userJwt.id }, { recipientId: userJwt.id }] },
        ],
      },
    });

    return messages;
  }
}
