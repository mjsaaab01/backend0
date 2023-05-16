import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from '../user/entities/user.entity';
import { MailerService } from 'src/utils/mail.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, MailerService],
  exports: [UserService],
})
export class UserModule {}
