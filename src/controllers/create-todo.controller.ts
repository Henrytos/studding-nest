import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/auth/cuerrent.user.decorator';
import { UserPayload } from 'src/auth/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('create-todo')
export class CreateTodoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub);
    return 'ok';
  }
}
