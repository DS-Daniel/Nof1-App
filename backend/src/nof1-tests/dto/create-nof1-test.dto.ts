import {
  AdministrationSchema,
  ClinicalInfo,
  RandomizationStrategy,
  Substance,
  SubstancePosologies,
  SubstancePosology,
  Variable,
} from '../@types/types';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDate,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { TestStatus } from '../../utils/constants';
import { Patient } from '../../persons/patients/schemas/patient.schema';
import { Physician } from '../../persons/physicians/schemas/physician.schema';
import { Pharmacy } from '../../persons/schemas/pharmacy.schema';

/**
 * Representation of the N-of-1 test information.
 */
export class CreateNof1TestDto {
  @IsObject()
  @ValidateNested()
  patient: Patient;

  @IsObject()
  @ValidateNested()
  physician: Physician;

  @IsObject()
  @ValidateNested()
  nof1Physician: Physician;

  @IsObject()
  @ValidateNested()
  pharmacy: Pharmacy;

  @IsObject()
  @ValidateNested()
  clinicalInfo: ClinicalInfo;

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
