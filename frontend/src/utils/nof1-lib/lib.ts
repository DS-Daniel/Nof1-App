import dayjs from 'dayjs';
import {
	SubstancePosologies,
	SubstancePosology,
} from '../../entities/posology';
import {
	getRandomElemFromArray,
	MaxRep,
	Permutation,
	Randomization,
	RandomizationStrategy,
	RandomStrategy,
} from './randomizationStrategy';
import { Substance } from '../../entities/substance';
import {
	AdministrationSchema,
	Nof1Test,
	TestStatus,
} from '../../entities/nof1Test';
import { TestData } from '../../entities/nof1Data';
import { administrationSchemaXlsx } from '../xlsx';

/**
 * For each substance in the passed array, select a random posology from all
 * of the posologies of the substance.
 * @param allPosologies Array of substances and their posologies.
 * @returns An array of objects containing the substance and its selected posology.
 */
export const selectRandomPosology = (allPosologies: SubstancePosologies[]) => {
	const selectedPosology: SubstancePosology[] = [];
	allPosologies.forEach(({ substance, unit, posologies }) => {
		selectedPosology.push({
			substance,
			unit,
			posology: getRandomElemFromArray(posologies),
		});
	});
	return selectedPosology;
};

/**
 * Generate a random administration sequence for all substances of the N-of-1 test,
 * according to the randomization strategy (for the number of periods).
 * The resulting array contains the substances abbreviations.
 * @param substances Substances of the N-of-1 test.
 * @param randomization Randomization strategy chosen.
 * @param nbPeriods Number of periods during the test.
 * @returns A randomized administration sequence for the substances.
 */
export const generateSequence = (
	substances: Substance[],
	randomization: RandomizationStrategy,
	nbPeriods: number,
) => {
	const substancesAbbrev = substances.map((s) => s.abbreviation);
	let r: Randomization;
	switch (randomization.strategy) {
		case RandomStrategy.Permutations:
			r = new Permutation();
			break;
		case RandomStrategy.MaxRep:
			r = new MaxRep(randomization.maxRep!);
			break;
	}
	return r.randomize(substancesAbbrev, nbPeriods);
};

/**
 * Generate the administration schema of substances for the N-of-1 test, according to
 * the selected substances, their posologies and the substances administration sequence.
 * @param substances Substances of the test.
 * @param seq Substances administration sequence.
 * @param posologies Posologies for substances.
 * @param periodLen Period Length.
 * @param nbPeriods Number of periods.
 * @returns An array containing the administration schema for every day of the N-of-1 test.
 */
export const generateAdministrationSchema = (
	substances: Substance[],
	seq: string[],
	posologies: SubstancePosology[],
	periodLen: number,
	nbPeriods: number,
): AdministrationSchema => {
	const result: AdministrationSchema = [];
	let dateCounter = 0;
	for (let i = 0; i < nbPeriods; i++) {
		const abbrev = seq[i];
		const substance = substances.find((s) => s.abbreviation === abbrev);
		if (!substance) throw new Error('substance not found');
		const posology = posologies.find(
			(e) => e.substance === substance.name,
		)?.posology;
		if (!posology) throw new Error('posology not found');
		// if a substance is repeated and repeatLast option is true, we repeat the last posology.
		if (
			i > 0 &&
			result.slice().pop()?.substance === substance.name &&
			posology.repeatLast
		) {
			const prev = result.slice().pop()!;
			for (let j = 0; j < periodLen; j++) {
				result.push({
					...prev,
					day: dateCounter++,
				});
			}
		} else {
			for (let j = 0; j < periodLen; j++) {
				result.push({
					day: dateCounter++,
					substance: substance.name,
					morning: posology.posology[j].morning,
					morningFraction: posology.posology[j].morningFraction,
					noon: posology.posology[j].noon,
					noonFraction: posology.posology[j].noonFraction,
					evening: posology.posology[j].evening,
					eveningFraction: posology.posology[j].eveningFraction,
					night: posology.posology[j].night,
					nightFraction: posology.posology[j].nightFraction,
					unit: substance.unit,
				});
			}
		}
	}
	return result;
};

/**
 * Calculate the total amount and number of doses to prepare for each substance.
 * Format the output for an XLSX export, with header and data in an array of array.
 * @param substances The substances.
 * @param schema The administration schema.
 * @param tradQty Translation text for the header.
 * @param tradDose Translation of the word "dose".
 * @returns An array of rows (array of array) for the XLSX export for each substance.
 */
export const substancesRecap = (
	substances: Substance[],
	schema: AdministrationSchema,
	tradQty: string,
	tradDose: string,
) => {
	return substances.map((s) => {
		let total = 0;
		let doses = 0;
		schema.forEach((row) => {
			if (row.substance === s.name) {
				total += row.morning + row.noon + row.evening + row.night;
				doses +=
					row.morningFraction +
					row.noonFraction +
					row.eveningFraction +
					row.nightFraction;
			}
		});
		return [[`${tradQty} "${s.name}":`], [total, s.unit], [doses, tradDose]];
	});
};

export const generateXlsxSchemaExample = (
	test: Nof1Test,
	xlsxData: {
		patientInfos: string[][];
		physicianInfos: string[][];
		nof1PhysicianInfos: string[][];
		schemaHeaders: string[];
	},
	recapTxt: { qty: string; dose: string },
) => {
	const selectedPosologies = selectRandomPosology(test.posologies);
	const substancesSequence = generateSequence(
		test.substances,
		test.randomization,
		test.nbPeriods,
	);
	const administrationSchema = generateAdministrationSchema(
		test.substances,
		substancesSequence,
		selectedPosologies,
		test.periodLen,
		test.nbPeriods,
	);
	const recap = substancesRecap(
		test.substances,
		administrationSchema,
		recapTxt.qty,
		recapTxt.dose,
	);
	return administrationSchemaXlsx({
		...xlsxData,
		schema: administrationSchema,
		substancesRecap: recap,
	});
};

/**
 * Format the patient's health variables data, to render it into a table.
 * @param data Patient health variables data.
 * @returns The formatted data (as an array of objects containing the
 * variables data for a date and substance (flat object).
 */
export const formatPatientDataToTable = (data: TestData): string[][] => {
	return data.map((d) => {
		const row = [
			new Date(d.date).toLocaleDateString(),
			d.substance,
			d.supposition ?? '',
			d.optimal ?? '',
			d.endPeriodRemark ?? '',
		];
		d.data.forEach((v) => row.push(v.value));
		return row;
	});
};

/**
 * Generate and return the default data for the N-of-1 test.
 * @param test N-of-1 test.
 * @returns The default test data array.
 */
export const defaultData = (test: Nof1Test): TestData => {
	let totalDuration = test.nbPeriods * test.periodLen;
	if (test.status === TestStatus.Interrupted) {
		totalDuration =
			dayjs(test.endingDate).diff(dayjs(test.beginningDate), 'day') + 1;
	}
	const data: TestData = [];
	for (let i = 0; i < totalDuration; i++) {
		data.push({
			day: i + 1,
			date: dayjs(test.beginningDate).add(i, 'day').toDate(),
			substance: test.administrationSchema![i].substance,
			data: test.monitoredVariables.map((variable) => ({
				variableName: variable.name,
				value: '',
			})),
		});
	}
	return data;
};
