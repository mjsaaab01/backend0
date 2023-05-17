import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Reservation } from './entities/reservation.entity';
import { MailerService } from '../utils/mail.service';
import { UserService } from '../user/user.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel('Reservation')
    private readonly reservationModel: Model<Reservation>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private roomService: RoomService,
  ) {}

  async getRooms(query) {
    const { name, section, day } = query;

    const reservations = await this.reservationModel.aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                section: 1,
              },
            },
          ],
        },
      },

      {
        $match: {
          'room.name': name,
          'room.section': section,
        },
      },

      { $unwind: '$room' },

      {
        $project: {
          _id: 0,
          startTime: 1,
          endTime: 1,
        },
      },
    ]);
console.log(reservations)
    const slots = [
      {
        startTime: new Date(`${day}T08:00:00.000Z`),
        endTime: new Date(`${day}T09:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T09:00:00.000Z`),
        endTime: new Date(`${day}T10:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T10:00:00.000Z`),
        endTime: new Date(`${day}T11:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T11:00:00.000Z`),
        endTime: new Date(`${day}T12:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T12:00:00.000Z`),
        endTime: new Date(`${day}T13:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T13:00:00.000Z`),
        endTime: new Date(`${day}T14:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T14:00:00.000Z`),
        endTime: new Date(`${day}T15:00:00.000Z`),
      },
      {
        startTime: new Date(`${day}T15:00:00.000Z`),
        endTime: new Date(`${day}T16:00:00.000Z`),
      },
    ];

    const availableSlots = slots.filter(
      (slot) =>
        !reservations
          .map((reservation) => reservation.startTime.getTime())
          .includes(slot.startTime.getTime()),
    );

    return availableSlots;
  }

  getUnacceptedReseravtions() {
    return this.reservationModel.aggregate([
      {
        $match: {
          accepted: false,
        },
      },

      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },

      { $unwind: '$room' },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);
  }

  async create(createReservationDto, id) {
    const { name, email } = await this.userService.findUserById(id);
    const room = await this.roomService.findById(createReservationDto['room']);

    await this.reservationModel.create({
      userId: id,
      roomId: createReservationDto['room'],
      startTime: new Date((createReservationDto['startTime'] + 10800) * 1000),
      endTime: new Date((createReservationDto['endTime'] + 10800) * 1000),
    });

    const html = `
                  <div style="display: flex; justify-content: center">
                    <div>
                      <strong>Hello ${name}</strong>
                        <p>Reservation,</p>
                        <p>You need to wait until confirmed from us</p>
                        <hr />
                        <p>Room: ${room.name}
                          section: ${room.section}
                          on ${new Date(
                            createReservationDto['startTime'] * 1000,
                          ).toDateString()}!
                        </p>
                        <p>
                          <b>From:</b> ${new Date(
                            createReservationDto['startTime'] * 1000,
                          ).getHours()}:00
                        </p>
                        <p>
                          <b>To:</b> ${new Date(
                            createReservationDto['endTime'] * 1000,
                          ).getHours()}:00
                        </p>
                        <br />
                    </div>
                  </div>
                `;

    this.mailerService.sendMail(
      email,
      `Verification by ${process.env.GMAIL_NAME}`,
      html,
    );
  }

  createForInstructor(createReservationDto, id) {
    this.reservationModel.create({
      userId: id,
      roomId: createReservationDto['room'],
      startTime: createReservationDto['startTime'],
      endTime: createReservationDto['endTime'],
    });
  }

  async update(id: string, updateReservationDto) {
    await this.reservationModel.updateOne(
      { _id: id },
      {
        $set: updateReservationDto,
      },
    );

    const reservation: any = await this.reservationModel.aggregate([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: id }] },
        },
      },

      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },

      { $unwind: '$room' },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    const day = ('0' + reservation[0].startTime.getDate()).slice(-2);
    const month = ('0' + (reservation[0].startTime.getMonth() + 1)).slice(-2);
    const year = reservation[0].startTime.getFullYear();

    const from = reservation[0].startTime.toISOString().substring(11, 16);
    const to = reservation[0].endTime.toISOString().substring(11, 16);

    const html = `
      <div style="display: flex; justify-content: center">
        <div>
          <strong>Hello ${reservation[0].user.name}</strong>
            <p>Your reserved room ${reservation[0].room.name} section: ${reservation[0].room.section}
    on ${day}-${month}-${year} from ${from} to ${to} is comfirmed</p>
        </div>
      </div>
    `;

    this.mailerService.sendMail(
      reservation[0].user.email,
      `Confirmation ${process.env.GMAIL_NAME}`,
      html,
    );
  }

  async remove(id: string) {
    const reservation: any = await this.reservationModel.aggregate([
      {
        $match: {
          $expr: { $eq: ['$_id', { $toObjectId: id }] },
        },
      },

      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },

      { $unwind: '$room' },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    await this.reservationModel.deleteOne({ _id: id });

    const day = ('0' + reservation[0].startTime.getDate()).slice(-2);
    const month = ('0' + (reservation[0].startTime.getMonth() + 1)).slice(-2);
    const year = reservation[0].startTime.getFullYear();

    const from = reservation[0].startTime.toISOString().substring(11, 16);
    const to = reservation[0].endTime.toISOString().substring(11, 16);

    const html = `
      <div style="display: flex; justify-content: center">
        <div>
          <strong>Hello ${reservation[0].user.name}</strong>
            <p>Your reserved room ${reservation[0].room.name} section: ${reservation[0].room.section}
    on ${day}-${month}-${year} from ${from} to ${to} is rejected</p>
        </div>
      </div>
    `;

    this.mailerService.sendMail(
      reservation[0].user.email,
      `Rejection ${process.env.GMAIL_NAME}`,
      html,
    );
  }

  async checkReservationTime() {
    const today = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    const tomorrow = new Date(new Date().getTime() + 14 * 60 * 60 * 1000);

    const response: any = await this.reservationModel.aggregate([
      {
        $match: {
          accepted: true,
          startTime: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },

      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },

      { $unwind: '$room' },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    response.forEach((reservation) => {
      const from = reservation.startTime.toISOString().substring(11, 16);
      const to = reservation.endTime.toISOString().substring(11, 16);

      const html = `
                    <div style="display: flex; justify-content: center">
                      <div>
                        <strong>Hello ${reservation.user.name}</strong>
                          <p>Reservation,</p>
                          <p>Dont forgot your reservation today!</p>
                          <hr />
                          <p>
                            Room: ${reservation.room.name}
                            section: ${reservation.room.section}
                          </p>
                          <p>
                            <b>From: </b>${from}
                          </p>
                          <p>
                            <b>To: </b>${to}
                          </p>
                          <br />
                      </div>
                    </div>
                  `;
      this.mailerService.sendMail(reservation.user.email, `Reminder`, html);
    });
  }
}
