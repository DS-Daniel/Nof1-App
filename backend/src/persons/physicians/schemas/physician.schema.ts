import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from '../../schemas/person.schema';

export type PhysicianDoc = Physician & Document;

/**
 * Schema representing a physician.
 */
@Schema()
export class Physician extends Person {
  @Prop({ required: true })
  institution: string;

  @Prop({ type: [String], required: false })
  tests: string[];
}

export const PhysicianSchema = SchemaFactory.createForClass(Physician);
