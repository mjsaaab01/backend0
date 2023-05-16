import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookSchema } from './entities/book.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
