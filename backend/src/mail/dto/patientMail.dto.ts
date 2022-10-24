import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
} from 'class-validator';

export class PatientMailDto {
  /**
   * Message to include into the email.
   */
  @IsObject()
  @IsNotEmptyObject()
  msg: {
    text: string;
    html: string;
  };

  /**
   * Destination email.
   */
  @IsEmail()
  dest: string;

  /**
   * Expiration date of the token for the patient's url.
   * Protect API routes and forbid access after expiration.
   */
  @IsInt()
  @IsNotEmpty()
  tokenExp: number;

  /**
   * Identifies the date before which the JWT must not be accepted for processing.
   * Protect API routes and forbid access before the right date.
   */
  @IsInt()
  @IsNotEmpty()
  notBefore: number;
}
