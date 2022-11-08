import { IsString, IsArray } from 'class-validator';

export type TestData = {
  day: number;
  date: Date;
  substance: string;
  data: {
    variableName: string;
    value: string;
  }[];
  supposition?: string;
  preference?: {
    value?: string;
    remark?: string;
  };
}[];

/**
 * Representation of the health variables data of a N-of-1 test.
 */
export class CreateNof1DataDto {
  @IsString()
  testId: string;

  @IsArray()
  data: TestData;
}
