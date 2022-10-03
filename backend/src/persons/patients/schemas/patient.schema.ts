import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from '../../schemas/person.schema';

export type PatientDoc = Patient & Document;

/**
 * Schema representing a patient.
 */
@Schema()
export class Patient extends Person {
  @Prop({ required: true })
  insurance: string;

  @Prop({ required: true })
  insuranceNb: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
