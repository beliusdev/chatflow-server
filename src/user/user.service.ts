import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UpdatePayloadDto } from './dto/update.dto';
import { DatabaseService } from 'src/database/database.service';
import { generateHashedPassword } from 'src/utils/helper';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCurrentUser(userJwt: any) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userJwt.id },
    });

    if (!user) throw new NotFoundException('User not found.');
    delete user.password;
    return user;
  }

  async updateCurrentUser(
    userJwt: any,
    { displayName, username }: UpdatePayloadDto,
  ) {
    const updatedUser = await this.databaseService.user.update({
      data: { displayName, username },
      where: { id: userJwt.id },
    });
    if (!updatedUser) throw new NotFoundException('User not found.');

    delete updatedUser.password;
    return updatedUser;
  }

  async searchUsers(userJwt: any, identifier: string) {
    const { id: currentUserId } = userJwt;

    const results = identifier
      ? await this.databaseService.user.findMany({
          where: {
            AND: [
              { username: { contains: identifier, mode: 'insensitive' } },
              {
                id: {
                  not: currentUserId,
                },
              },
            ],
          },
        })
      : null;

    results &&
      results.forEach((result) => {
        delete result.email;
        delete result.password;
      });

    return results;
  }

  async changePassword(userJwt: any, password: string, newPassword: string) {
    const currentUser = await this.databaseService.user.findUnique({
      where: { id: userJwt },
    });
    if (!currentUser) throw new NotFoundException('User not found.');

    const isCorrectPassword = bcrypt.compare(password, currentUser.password);
    if (!isCorrectPassword) throw new UnauthorizedException();

    const hashedPassword = await generateHashedPassword(password);
    await this.databaseService.user.update({
      data: { password: hashedPassword },
      where: { id: currentUser.id },
    });

    return { success: true };
  }

  async deleteCurrentUser(userJwt: any, password: string) {
    const user = await this.databaseService.user.delete({
      where: { id: userJwt.id },
    });
    if (!user) throw new NotFoundException('User not found.');

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('User not found.');

    return { success: true };
  }
}
