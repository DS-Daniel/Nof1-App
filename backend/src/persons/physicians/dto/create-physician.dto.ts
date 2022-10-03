import { IsString, IsOptional, IsArray } from 'class-validator';
import { CreatePersonDto } from '../../commonDto/create-person.dto';

/**
 * Physician specific information.
 */
export class CreatePhysicianDto extends CreatePersonDto {
  @IsString()
  institution: string;

  @IsOptional()
  @IsArray()
  tests?: string[];
}
