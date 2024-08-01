import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('create-todo')
export class CreateTodoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle() {
    return 'ok';
  }
}
