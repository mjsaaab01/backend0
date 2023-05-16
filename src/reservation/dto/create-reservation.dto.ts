import { IsMongoId, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateReservationDto {
  @IsMongoId()
  readonly room: ObjectId;

  @IsNumber()
  readonly startTime: number;

  @IsNumber()
  readonly endTime: number;
}
