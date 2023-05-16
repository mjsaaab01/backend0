import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ERole } from '../../types/user.type';

@Schema({ timestamps: true })
class User extends Document {
  @Prop({ trim: true, required: true, lowercase: true })
  readonly name: string;

  @Prop({
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
    // match: /^[A-Za-z0-9._%+-]+@ndu.edu\.lb$/,
  })
  readonly email: string;

  @Prop({
    trim: true,
    required: true,
    minlength: 8,
    match: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  })
  readonly password: string;

  @Prop({ required: true, default: ERole.STUDENT, enum: ERole })
  readonly role: ERole;

  @Prop({ required: true })
  readonly key: string;

  @Prop({ required: true, default: false })
  readonly isValid: boolean;

  @Prop({ required: true, default: false })
  readonly isVerified: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { User, UserSchema };
