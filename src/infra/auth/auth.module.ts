import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { Env } from '../env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privateKeySecret = config.get('JWT_PRIVATE_KEY')
        const publicKeySecret = config.get('JWT_PUBLIC_KEY')
        return {
          signOptions: {
            algorithm: 'RS256',
          },
          publicKey: Buffer.from(publicKeySecret, 'base64'),
          privateKey: Buffer.from(privateKeySecret, 'base64'),
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
