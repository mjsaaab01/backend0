import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomSchema } from './entities/room.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
