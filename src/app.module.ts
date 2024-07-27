import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';

//orquestrador de dependecias
@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
