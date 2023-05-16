import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { MailerService } from '../utils/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, MailerService],
})
export class AuthModule {}
