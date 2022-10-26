export enum RandomStrategy {
  Permutations = 'Permutations',
  MaxRep = 'MaxRep',
  Random = 'Random',
}

// Randomization strategy object.
export interface RandomizationStrategy {
  strategy: RandomStrategy;
  // optional options
  maxRep?: number;
}

// posology for a day.
export type PosologyDay = {
  day: number;
  morning: number;
  morningFraction: number;
  noon: number;
  noonFraction: number;
  evening: number;
  eveningFraction: number;
  night: number;
  nightFraction: number;
};

// posology for a day with date for a substance.
export type AdministrationSchema = {
  // date: string;
  substance: string;
  unit: string;
} & PosologyDay;
// } & Omit<PosologyDay, 'day'>;

// posology for a day, with repeated option.
export type Posology = {
  posology: PosologyDay[];
  repeatLast: boolean;
};

// a substance with its different posologies.
export class SubstancePosologies {
  substance: string;
  unit: string;
  posologies: Posology[];
}

// a substance with its posology.
export class SubstancePosology {
  substance: string;
  unit: string;
  posology: Posology;
}

// Variable infos.
export class Variable {
  name: string;
  type: VariableType;
  desc: string;
  unit?: string;
  min?: string | number;
  max?: string | number;
  values?: string;
}

export enum VariableType {
  Text = 'Text',
  VAS = 'VAS',
  Binary = 'Binary',
  Numeric = 'Numeric',
  Qualitative = 'Qualitative',
}

// Substance infos.
export class Substance {
  name: string;
  abbreviation: string;
  unit: string;
}

export class ClinicalInfo {
  sex: string;
  age: string;
  weight: string;
  height: string;
  indication: string;
  otherDiag: string;
  drugs: string;
  otherDrugs: string;
  purpose: {
    efficacy: boolean;
    sideEffects: boolean;
    deprescription: boolean;
    dosage: boolean;
    drugsChoice: boolean;
    genericSubstitutions: boolean;
    other: boolean;
  };
}