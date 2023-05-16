import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
class Reservation extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  readonly userId: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Room' })
  readonly roomId: string;

  @Prop({ required: true, type: Date })
  readonly startTime: Date;

  @Prop({ required: true, type: Date })
  readonly endTime: Date;

  @Prop({ required: true, type: Boolean, default: false })
  readonly accepted: boolean;
}

const ReservationSchema = SchemaFactory.createForClass(Reservation);

export { Reservation, ReservationSchema };
