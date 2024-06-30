import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createChat(userJwt: any, secondUserId: number) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userJwt.id,
      },
    });
    const chat = await this.databaseService.chat.findFirst({
      where: {
        members: {
          hasEvery: [userJwt.id, secondUserId],
        },
      },
    });

    if (chat) return chat;

    const secondUser = await this.databaseService.user.findUnique({
      where: {
        id: secondUserId,
      },
    });

    if (!secondUser) throw new NotFoundException("User not found.");

    const newChat = await this.databaseService.chat.create({
      data: {
        members: [user.id, secondUserId],
        usernames: [user.username, secondUser.username],
        names: [user.displayName, secondUser.displayName],
      },
    });

    return newChat;
  }

  async findUserChats(userJwt: any) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userJwt.id },
    });
    const chats = await this.databaseService.chat.findMany({
      where: {
        members: {
          has: userJwt.id,
        },
      },
    });

    const chatsResult = chats.map((chat) => ({
      senderUsername: chat.usernames.find(
        (username) => username !== user.username
      ),
      senderName: chat.names.find((name) => name !== user.displayName),
      lastMessage: chat.lastMessage,
      chatId: chat.id,
      createdAt: chat.createdAt,
    }));

    return chatsResult;
  }

  async findChat(userJwt: any, chatId: number) {
    if (!chatId) throw new NotFoundException("Chat was not found.");

    const chat = await this.databaseService.chat.findFirst({
      where: {
        AND: [
          {
            id: chatId,
          },
          { members: { has: userJwt.id } },
        ],
      },
    });

    if (!chat) throw new NotFoundException("Chat was not found.");

    return chat;
  }
}
