import { IsNotEmptyObject, IsObject } from 'class-validator';
import { AdministrationSchema } from 'src/nof1-tests/@types/types';
import { MailDto } from './mail.dto';

/**
 * Information required to generate the xlsx file about the N-of-1 test.
 */
export interface MailData {
  patientInfos: string[][];
  physicianInfos: string[][];
  nof1PhysicianInfos: string[][];
  schemaHeaders: string[];
  schema: AdministrationSchema[];
  substancesRecap: (string | number)[][][];
}

export class PharmaMailDto extends MailDto {
  /**
   * Information to generate the xlsx file.
   */
  @IsObject()
  @IsNotEmptyObject()
  data: MailData;
}
