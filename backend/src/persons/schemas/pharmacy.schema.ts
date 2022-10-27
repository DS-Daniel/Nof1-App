import { Address, AddressSchema } from './address.schema';
import { Schema } from 'mongoose';
// import { encrypt, decrypt } from '../../utils/cipher';

export class Pharmacy {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

/**
 * Schema representing the pharmacy information.
 */
export const PharmacySchema = new Schema<Pharmacy>(
  {
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: AddressSchema },
  },
  {
    versionKey: false,
    _id: false,
    //  toObject: { getters: true },
    //  toJSON: { getters: true },
  },
);
