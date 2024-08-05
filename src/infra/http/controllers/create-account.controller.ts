import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ConflictException,
} from '@nestjs/common'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const passwordHash = await hash(password, 8)

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    await this.prisma.user.create({
      data: {
        email,
        name,
        password_hash: passwordHash,
      },
    })

    return {
      message: 'user created successfully',
    }
  }
}
