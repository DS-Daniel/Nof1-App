import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Patient,
  PatientSchema,
} from '../../persons/patients/schemas/patient.schema';
import {
  Physician,
  PhysicianSchema,
} from '../../persons/physicians/schemas/physician.schema';
import {
  AdministrationSchema,
  ClinicalInfo,
  RandomizationStrategy,
  Substance,
  SubstancePosologies,
  SubstancePosology,
  Variable,
} from '../@types/types';
import { TestStatus } from '../../utils/constants';
import mongooseLeanGetters from 'mongoose-lean-getters';

type Nof1TestDoc = Nof1Test & Document;

/**
 * Schema representing the N-of-1 test information.
 */
@Schema({
  versionKey: false,
  // Enable to use getters on almost all queries:
  toObject: { getters: true },
  toJSON: { getters: true },
})
class Nof1Test {
  @Prop()
  uid: string;

  @Prop({ type: PatientSchema, required: true })
  patient: Patient;

  @Prop({ type: PhysicianSchema, required: true })
  physician: Physician;

  @Prop({ type: PhysicianSchema, required: true })
  nof1Physician: Physician;

  // no validation to allow empty default value in case of a draft test creation,
  // where this field is not filled in.
  @Prop()
  pharmaEmail: string;

  @Prop({ type: Object, required: true })
  clinicalInfo: ClinicalInfo;

  @Prop({ type: String, required: true, enum: Object.values(TestStatus) })
  status: TestStatus;

  @Prop({ required: true })
  nbPeriods: number;

  @Prop({ required: true })
  periodLen: number;

  @Prop({ type: Object, required: true })
  randomization: RandomizationStrategy;

  @Prop()
  beginningDate: Date;

  @Prop()
  endingDate: Date;

  @Prop({ type: [String] })
  substancesSequence: string[];

  @Prop({ type: [Object] })
  administrationSchema: AdministrationSchema[];

  @Prop({ type: [Object], required: true })
  substances: Substance[];

  @Prop({ type: [Object], required: true })
  posologies: SubstancePosologies[];

  @Prop({ type: [Object] })
  selectedPosologies: SubstancePosology[];

  @Prop({ type: [Object], required: true })
  monitoredVariables: Variable[];

  @Prop({ type: Object })
  meta_info: {
    creationDate: Date;
    emailSendingDate?: Date;
  };
}

const Nof1TestSchema = SchemaFactory.createForClass(Nof1Test);

Nof1TestSchema.plugin(mongooseLeanGetters);

export { Nof1TestSchema, Nof1Test, Nof1TestDoc };
