import { IsString } from 'class-validator';
import { CreatePersonDto } from '../../commonDto/create-person.dto';

/**
 * Patient specific information.
 */
export class CreatePatientDto extends CreatePersonDto {
  @IsString()
  insurance: string;

  @IsString()
  insuranceNb: string;
}
