import { PosologyDay } from './posology';

export interface Substance {
	[key: string]: string | PosologyDay[] | undefined;
	name: string;
	abbreviation: string;
	unit: string;
	decreasingDosage?: PosologyDay[];
}

export const emptySubstance = {
	name: '',
	abbreviation: '',
	unit: '',
};
