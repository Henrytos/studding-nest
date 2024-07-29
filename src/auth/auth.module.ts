import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Env } from 'src/env';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<Env, true>) {
        const secret = configService.get('JWT_SECRET');
        return {
          secret,
          verifyOptions: {
            algorithms: ['RS256'],
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
