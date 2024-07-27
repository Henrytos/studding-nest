import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  UsePipes,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('create-account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const passwordHash = await hash(password, 8);

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      );
    }

    await this.prisma.user.create({
      data: {
        email,
        name,
        password_hash: passwordHash,
      },
    });

    return {
      message: 'user created successfully',
    };
  }

  @Get()
  @Redirect(
    'https://www.youtube.com/watch?v=S36SCGmskww&list=RDS36SCGmskww&start_radio=1',
    301,
  )
  getMyFavoriteMusic() {}
}
