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

export type Posology = {
	posology: PosologyDay[];
	repeatLast: boolean;
};

export type SubstancePosologies = {
	substance: string;
	posologies: Posology[];
};

export type SubstancePosology = {
	substance: string;
	posology: Posology;
};

export type PosologySchema = SubstancePosology[];

/**
 * Returns a default Posology object.
 * @param nbRows Number of days for the posology.
 * @returns A default Posology object.
 */
export const initialPosology = (nbRows: number): Posology => {
	const rows: PosologyDay[] = [];
	const defaultPos = {
		morning: 0,
		morningFraction: 1,
		noon: 0,
		noonFraction: 1,
		evening: 0,
		eveningFraction: 1,
		night: 0,
		nightFraction: 1,
	};
	for (let i = 1; i <= nbRows; i++) {
		rows.push({ day: i, ...defaultPos });
	}
	return {
		posology: rows,
		repeatLast: false,
	};
};
