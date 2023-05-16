import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AccountValidationDto {
  @IsMongoId()
  readonly userId: ObjectId;
}
