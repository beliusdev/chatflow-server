import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import { DatabaseService } from "src/database/database.service";
import { LoginPayloadDto } from "./dto/login.dto";
import { RegisterPayloadDto } from "./dto/register.dto";
import {
  generateHashedPassword,
  generateVerificationToken,
} from "src/utils/helper";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly databaseService: DatabaseService
  ) {}

  async checkUsernameAvailability(username: string) {
    const checkUsername = await this.databaseService.user.findUnique({
      where: { username },
    });

    return checkUsername;
  }

  async checkEmailAvailability(email: string) {
    const checkEmail = await this.databaseService.user.findUnique({
      where: { email },
    });

    return checkEmail;
  }

  async register({
    displayName,
    username,
    email,
    password,
  }: RegisterPayloadDto) {
    const hashedPassword = await generateHashedPassword(password);
    const user = await this.databaseService.user.create({
      data: {
        displayName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
      },
    });
    const token = generateVerificationToken();
    const jwtToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_SECRET }
    );
    await this.databaseService.emailVerificationToken.create({
      data: { userId: user.id, token },
    });

    await this.mailService.emailVerification(user, token);

    delete user.password;
    return { user, token: jwtToken };
  }

  async login({ identifier, password }: LoginPayloadDto) {
    const user = identifier.includes("@")
      ? await this.databaseService.user.findUnique({
          where: { email: identifier },
        })
      : await this.databaseService.user.findUnique({
          where: { username: identifier },
        });

    if (!user) throw new NotFoundException("User not found.");

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException();

    const token = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_SECRET }
    );
    delete user.password;
    return { user, token };
  }

  async verify(token: string) {
    const result = await this.databaseService.emailVerificationToken.findUnique(
      { where: { token } }
    );

    if (!result) throw new UnauthorizedException();

    const user = await this.databaseService.user.update({
      data: { isVerified: true },
      where: { id: result.userId },
    });

    delete user.password;
    return user;
  }

  async resendEmailVerificationToken(userJwt: any) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userJwt.id },
    });
    if (!user) throw new NotFoundException("User not found.");

    const token = generateVerificationToken();

    await this.mailService.emailVerification(user, token);
    await this.databaseService.emailVerificationToken.create({
      data: { userId: user.id, token },
    });

    return { success: true };
  }
}
