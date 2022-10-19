import { Schema } from 'mongoose';
import { encrypt, decrypt } from '../../utils/cipher';

export class Address {
  street: string;
  zip: string;
  city: string;
}

/**
 * Schema representing address information.
 */
export const AddressSchema = new Schema<Address>(
  {
    street: { type: String, required: true, get: decrypt, set: encrypt },
    zip: { type: String, required: true, get: decrypt, set: encrypt },
    city: { type: String, required: true, get: decrypt, set: encrypt },
  },
  {
    versionKey: false,
    _id: false,
    toObject: { getters: true },
    toJSON: { getters: true },
  },
);
