import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDoc = User & Document;

/**
 * Schema representing a user.
 */
@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
