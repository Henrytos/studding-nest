import { Controller, Get, HttpCode } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Controller('sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Get()
  @HttpCode(201)
  async handle() {
    const payload = { sub: '123123', username: 'henry' };
    const token = this.jwt.sign(payload);

    return {
      token,
    };
  }
}
