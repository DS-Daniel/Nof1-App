import { TestData } from '../entities/nof1Data';
import { Substance } from '../entities/substance';
import { Variable } from '../entities/variable';

/**
 * Format test data to a compatible format for charts.
 * @param testData Health variables data.
 * @param variable Concerned variable, to represent on the chart.
 * @param periodLen Length of periods between substances.
 * @returns The formatted data for the concerned variable.
 */
export const formatGraphData = (
	testData: TestData,
	variable: Variable,
	periodLen: number,
) => {
	const graphData: { [key: string]: string | number }[] = [];
	// to avoid a line break in the graph, when changing substance at the end of a period,
	// the previous substance is added again (links the line to the next point).
	// We use a counter and a stored value to achieve that.
	let cpt = periodLen;
	let prevSubstance: string;
	testData.map((d) => {
		const v = d.data.find((v) => v.variableName === variable.name);
		const entry: { [key: string]: string | number } = {};

		// add both entries when changing periods.
		if (cpt === 1) {
			prevSubstance = d.substance;
		}
		if (cpt === 0) {
			entry[prevSubstance] = v!.value;
			cpt = periodLen - 1;
		} else {
			cpt--;
		}

		entry['day'] = d.day;
		entry[`${d.substance}`] = v!.value;
		graphData.push(entry);
	});
	return graphData;
};

/**
 * Generate a random hex color.
 */
export const randomHexColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i += 1) {
		color += letters[Math.floor(Math.random() * (15 - 0 + 1) + 0)];
	}
	return color;
}

/**
 * Retrieve the current substance of the current period.
 * @param day Day number.
 * @param periodLen Period length.
 * @param substancesSeq Substance administration sequence selected for the N-of-1 test.
 * @param substances Array of substances of the N-of-1 test.
 * @returns The current substance of the current period.
 */
export const currentSubstance = (day: number, periodLen: number, substancesSeq: string[], substances: Substance[]) => {
	const abbrev = substancesSeq[(day - 1) / periodLen];
	const sub = substances.find(s => s.abbreviation === abbrev)
	return sub?.name;
}
