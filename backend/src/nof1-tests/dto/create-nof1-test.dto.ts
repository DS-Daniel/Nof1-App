import {
  AdministrationSchema,
  RandomizationStrategy,
  Substance,
  SubstancePosologies,
  SubstancePosology,
  Variable,
} from '../@types/types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDate,
  IsObject,
  IsNotEmptyObject,
  ValidateIf,
} from 'class-validator';
import { TestStatus } from '../../utils/constants';
import { Patient } from '../../persons/patients/schemas/patient.schema';
import { Physician } from '../../persons/physicians/schemas/physician.schema';

/**
 * Representation of the N-of-1 test information.
 */
export class CreateNof1TestDto {
  @IsObject()
  @IsNotEmptyObject()
  patient: Patient;

  @IsObject()
  @IsNotEmptyObject()
  physician: Physician;

  @IsObject()
  @IsNotEmptyObject()
  nof1Physician: Physician;

  @ValidateIf((test) => test.pharmaEmail !== '')
  // allow creation of a test in draft mode (with default empty values),
  // where this field is not filled in and can be further edited.
  @IsEmail()
  pharmaEmail: string;

  @IsEnum(TestStatus)
  status: TestStatus;

  @IsNotEmpty()
  @IsNumber()
  nbPeriods: number;

  @IsNotEmpty()
  @IsNumber()
  periodLen: number;

  @IsObject()
  @IsNotEmptyObject()
  randomization: RandomizationStrategy;

  @IsOptional()
  @IsDate()
  beginningDate?: Date;

  @IsOptional()
  @IsDate()
  endingDate?: Date;

  @IsOptional()
  @IsArray()
  substancesSequence: string[];

  @IsOptional()
  @IsArray()
  administrationSchema: AdministrationSchema[];

  @IsArray()
  substances: Substance[];

  @IsArray()
  posologies: SubstancePosologies[];

  @IsOptional()
  @IsArray()
  selectedPosologies: SubstancePosology[];

  @IsArray()
  monitoredVariables: Variable[];

  @IsObject()
  @IsNotEmptyObject()
  meta_info: {
    creationDate: Date;
    emailSendingDate?: Date;
  };
}
