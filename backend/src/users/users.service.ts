import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDoc } from './schemas/user.schema';

/**
 * Service managing users.
 */
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) {}

  /**
   * Create a new user.
   * Used by the Authentication Service upon registration.
   * @param email User email.
   * @param password User password.
   * @returns The document of the created user or an exception in case of error.
   */
  async create(email: string, password: string) {
    try {
      const newUser = new this.userModel({ email, password });
      return await newUser.save();
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw new ForbiddenException('User already exists!');
      } else {
        throw err;
      }
    }
  }

  /**
   * Find a user by email.
   * Used by the Authentication Service to find user for authentication.
   * @param email User email.
   * @returns The user document or null.
   */
  async findByEmail(email: string) {
    return await this.userModel
      .findOne({ email: email })
      .lean({ getters: true });
  }

  /**
   * Check if a user with the provided email exists.
   * @param email User email.
   * @returns The user document id or null.
   */
  async exists(email: string) {
    const response = await this.userModel
      .exists({ email: email })
      .lean({ getters: true });
    return { response };
  }

  /**
   * Update a user email.
   * @param email Current email.
   * @param newEmail New email.
   * @returns A message indicating a successful update or a BadRequest exception.
   */
  async update(email: string, newEmail: string) {
    const response = await this.userModel
      .findOneAndUpdate({ email: email }, { email: newEmail })
      .lean({ getters: true });
    if (response === null) {
      throw new BadRequestException('User not found');
    }
    return { msg: 'updated' };
  }

  /**
   * Delete a user by email.
   * @param email User email.
   * @returns An object indicating the delete count.
   */
  async remove(email: string) {
    return await this.userModel.deleteOne({ email: email });
  }
}
