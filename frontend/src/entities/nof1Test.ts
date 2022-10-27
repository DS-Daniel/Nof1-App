import { TestStatus } from '../utils/constants';
import { RandomizationStrategy } from '../utils/nof1-lib/randomizationStrategy';
import { IClinicalInfo } from './clinicalInfo';
import { Patient, Pharmacy, Physician } from './people';
import { PosologyDay, SubstancePosologies, SubstancePosology } from './posology';
import { Substance } from './substance';
import { Variable } from './variable';

export interface Nof1Test {
	uid?: string;
	patient: Patient;
	physician: Physician;
	nof1Physician: Physician;
	pharmacy: Pharmacy;
	clinicalInfo: IClinicalInfo;
	status: TestStatus;
	nbPeriods: number;
	periodLen: number;
	randomization: RandomizationStrategy;
	beginningDate?: Date;
	endingDate?: Date;
	substancesSequence?: string[];
	administrationSchema?: AdministrationSchema;
	substances: Substance[];
	posologies: SubstancePosologies[];
	selectedPosologies?: SubstancePosology[];
	monitoredVariables: Variable[];
	meta_info?: {
		creationDate: Date;
		emailSendingDate?: Date;
	};
}

export type AdministrationSchema = ({
	// date: string;
	// day: number;
	substance: string;
	unit: string;
} & PosologyDay)[];
// } & Omit<PosologyDay, 'day'>)[];
