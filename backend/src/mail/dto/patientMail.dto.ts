import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
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
   * Token expiration limit for the patient url.
   * Protect API routes and forbid access after expiration.
   */
  @IsString()
  @IsNotEmpty()
  tokenExp: string;
}
