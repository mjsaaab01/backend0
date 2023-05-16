import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
class Book extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  readonly userId: string;

  @Prop({ trim: true, required: true, lowercase: true })
  readonly name: string;

  @Prop({ trim: true, required: true, lowercase: true })
  readonly description: string;

  @Prop({ required: true })
  readonly imageUrl: string;
}

const BookSchema = SchemaFactory.createForClass(Book);

export { Book, BookSchema };
