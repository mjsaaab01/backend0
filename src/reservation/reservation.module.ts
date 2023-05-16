import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationSchema } from './entities/reservation.entity';
import { UserModule } from '../user/user.module';
import { MailerService } from '../utils/mail.service';
import { RoomSchema } from '../room/entities/room.entity';
import { RoomService } from '../room/room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reservation', schema: ReservationSchema },
      { name: 'Room', schema: RoomSchema },
    ]),

    UserModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, RoomService, MailerService],
  exports: [ReservationService],
})
export class ReservationModule {}
