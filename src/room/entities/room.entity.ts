import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
class Room extends Document {
  @Prop({ trim: true, required: true, lowercase: true })
  readonly name: string;

  @Prop({ trim: true, required: true, lowercase: true })
  readonly section: string;
}

const RoomSchema = SchemaFactory.createForClass(Room);

export { Room, RoomSchema };
