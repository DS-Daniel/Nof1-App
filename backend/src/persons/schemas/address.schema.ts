import { Schema } from 'mongoose';
import { cityRegex, streetRegex } from '../../utils/constants';

export interface Address {
  street: string;
  zip: number;
  city: string;
}

/**
 * Schema representing address information.
 */
export const AddressSchema = new Schema<Address>({
  street: {
    type: String,
    required: true,
    match: streetRegex,
  },
  zip: { type: Number, required: true },
  city: {
    type: String,
    required: true,
    match: cityRegex,
  },
});
