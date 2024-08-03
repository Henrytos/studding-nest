import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/cuerrent.user.decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';

const createTodoBodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

type CreateTodoBodySchema = z.infer<typeof createTodoBodySchema>;

const zodValidationPipe = new ZodValidationPipe(createTodoBodySchema);
@UseGuards(JwtAuthGuard)
@Controller('/todos')
export class CreateTodoController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe)
    todo: CreateTodoBodySchema,
  ) {
    const { title, description } = todo;
    const userId = user.sub;
    const isUserExists = this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!isUserExists) {
      return new NotFoundException('User does not exist');
    }

    await this.prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });
  }
}
