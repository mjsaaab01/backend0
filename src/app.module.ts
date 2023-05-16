import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { RoleGuard } from './guards/role.guard';
import { TasksService } from './utils/tasks.service';
import { ReservationSchema } from './reservation/entities/reservation.entity';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DATABASE_URI}`),

    MongooseModule.forFeature([
      { name: 'Reservation', schema: ReservationSchema },
    ]),

    UserModule,
    AuthModule,
    RoomModule,
    ReservationModule,
    BookModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },

    Logger,
    TasksService,
  ],
})
export class AppModule {}
