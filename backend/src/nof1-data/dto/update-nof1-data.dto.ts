import { PartialType } from '@nestjs/mapped-types';
import { CreateNof1DataDto } from './create-nof1-data.dto';

export class UpdateNof1DataDto extends PartialType(CreateNof1DataDto) {}
