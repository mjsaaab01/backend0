import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';

import { BookService } from './book.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { TObjectId } from '../types/user.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { log } from 'console';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const randomName = Array(32)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join('');
  //         cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  create(
    // @UploadedFile() file,
    @Body() createBookDto,
    @CurrentUser() user: TObjectId,
  ) {
    return this.bookService.create(createBookDto, user.id);
  }

  @Get()
  findAllWithoutUser(@CurrentUser() user: TObjectId) {
    return this.bookService.findAllWithoutUser(user.id);
  }

  @Get('mybooks')
  findUser(@CurrentUser() user: TObjectId) {
    return this.bookService.findUser(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
