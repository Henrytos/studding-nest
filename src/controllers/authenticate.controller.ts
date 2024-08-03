import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;
@Controller('sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(@Body() { email, password }: AuthenticateBodySchema) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NotFoundException('User does not exist');
    }

    const isPasswordValid = await compare(password, user?.password_hash);

    if (!isPasswordValid) {
      return new NotFoundException('Password does not match');
    }

    const payload = { sub: user.id };
    const token = this.jwt.sign(payload, {
      expiresIn: '7d',
    });

    return {
      access_token: token,
    };
  }
}
