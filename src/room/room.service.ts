import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private readonly roomModel: Model<Room>) {}

  create(createRoomDto: CreateRoomDto) {
    this.roomModel.create({
      name: createRoomDto['name'],
      section: createRoomDto['section'],
    });
  }

  findById(id: string) {
    return this.roomModel.findById(id);
  }

  findAllForStudent() {
    return this.roomModel
      .find({
        name: {
          $in: [
            'sport field',
            'conference room',
            'bussines office',
            'student affairs office',
            'office of the registrar',
            'sport room',
            'music room',
          ],
        },
      })
      .sort({
        name: 1,
        section: 1,
      });
  }

  async findAllForInstructor() {
    const test = await this.roomModel
      .find({
        name: {
          $in: [
            'sport field',
            'conference room',
            'exam hall',
            'classroom',
            'sport room',
            'music room',
          ],
        },
      })
      .sort({
        name: 1,
        section: 1,
      });
    console.log(test);

    return test;
  }
}
