import { Prop } from '@nestjs/mongoose';
import validator from 'validator';
import { Address, AddressSchema } from './address.schema';

/**
 * (Not directly a schema, but used as a basis for Schemas)
 * Class representing a person common information.
 * Base class for PatientSchema and PhysicianSchema.
 */
export class Person {
  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({
    required: true,
    validate: [validator.isNumeric, 'Phone number can only contains numbers'],
  })
  phone: string;

  @Prop({
    required: true,
    validate: [validator.isEmail, 'Format of email is invalid'],
  })
  email: string;
}
