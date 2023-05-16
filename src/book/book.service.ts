import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import { Model, ObjectId } from 'mongoose';
import { Book } from './entities/book.entity';

const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class BookService {
  constructor(
    @InjectModel('Book')
    private readonly bookModel: Model<Book>,
  ) {}

  async create(createBookDto, userId) {
    const { name, description, imageUrl } = createBookDto;

    return await this.bookModel.create({
      userId,
      name,
      description,
      imageUrl,
    });
  }

  async findAllWithoutUser(userId) {
    const books = await this.bookModel.aggregate([
      {
        $match: {
          userId: {
            $not: {
              $eq: ObjectId(userId),
            },
          },
        },
      },

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

    return books;
  }

  async findUser(userId) {
    const books = await this.bookModel
      .find({
        userId,
      })
      .sort({ createdAt: -1 });

    return books;
  }

  remove(id: string) {
    return this.bookModel.deleteOne({ _id: id });
  }
}
