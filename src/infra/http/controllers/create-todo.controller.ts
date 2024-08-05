import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/cuerrent.user.decorator'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const createTodoBodySchema = z.object({
  title: z.string(),
  description: z.string(),
})

type CreateTodoBodySchema = z.infer<typeof createTodoBodySchema>

const zodValidationPipe = new ZodValidationPipe(createTodoBodySchema)
@UseGuards(JwtAuthGuard)
@Controller('/todos')
export class CreateTodoController {
  private prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe)
    todo: CreateTodoBodySchema,
  ) {
    const { title, description } = todo
    const userId = user.sub
    const isUserExists = this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!isUserExists) {
      return new NotFoundException('User does not exist')
    }

    await this.prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    })
  }
}
