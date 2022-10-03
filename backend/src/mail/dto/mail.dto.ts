import { IsEmail, IsNotEmptyObject, IsObject } from 'class-validator';
import { AdministrationSchema } from 'src/nof1-tests/@types/types';

/**
 * Information required to generate the xlsx file about the N-of.1 test.
 */
export interface MailData {
  patientInfos: string[][];
  physicianInfos: string[][];
  nof1PhysicianInfos: string[][];
  schemaHeaders: string[];
  schema: AdministrationSchema[];
  substancesRecap: (string | number)[][][];
}

export class MailDto {
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
   * Information to generate the xlsx file.
   */
  @IsObject()
  @IsNotEmptyObject()
  data: MailData;
}
