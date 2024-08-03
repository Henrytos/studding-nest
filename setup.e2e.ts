import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import 'dotenv/config';

const prisma = new PrismaClient();

beforeAll(() => {
  process.env.DATABASE_URL = 'file:./database-devlopment-test.db';
  execSync('npx prisma migrate deploy');
});

afterAll(() => {
  prisma.user.deleteMany();
  prisma.todo.deleteMany();
  prisma.$disconnect();
});
