import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { Delete } from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { TObjectId } from '../types/user.type';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseGuards(RoleGuard)
  getRooms(@Query() query: any) {
    return this.reservationService.getRooms(query);
  }

  @Post()
  @UseGuards(RoleGuard)
  createForStudent(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: TObjectId,
  ) {
    return this.reservationService.create(createReservationDto, user.id);
  }

  @Get('unaccepted')
  getUnacceptedReseravtions() {
    return this.reservationService.getUnacceptedReseravtions();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
