import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { RoomService } from './room.service';
import { RoleGuard } from '../guards/role.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('student')
  @UseGuards(RoleGuard)
  findAllForStudent() {
    return this.roomService.findAllForStudent();
  }

  @Get('instructor')
  @UseGuards(RoleGuard)
  findAllForInstructor() {
    return this.roomService.findAllForInstructor();
  }

  @Post()
  create(@Body() createRoomDto) {
    return this.roomService.create(createRoomDto);
  }
}
