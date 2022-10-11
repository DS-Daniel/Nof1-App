import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Nof1Test } from '../../entities/nof1Test';
import { TestData } from '../../entities/nof1Data';
import { Variable, VariableType } from '../../entities/variable';
import LogbookCard from './LogbookCard';
import Binary from './Binary';
import Numeric from './Numeric';
import Text from './Text';
import Qualitative from './Qualitative';
import VAS from './VAS';
import { MutableRefObject } from 'react';

interface LogbookProps {
	test: Nof1Test | undefined;
	testData: MutableRefObject<TestData | undefined>;
}

/**
 * Component that renders the patient's health variables form, for the entire test period.
 */
export default function Logbook({ test, testData }: LogbookProps) {
	/**
	 * Curry fonction to update the health data.
	 * @param dayIdx index of the day.
	 * @param varIdx index of the variable.
	 * @returns A function to update the health data.
	 */
	const updateTestData = (dayIdx: number, varIdx: number) => {
		return (value: string) => {
			testData.current![dayIdx].data[varIdx].value = value;
		};
	};

	/**
	 * Helper to render the correct Variable component, depending on its type.
	 * @param variable Variable.
	 * @param varIndex Variable index.
	 * @param defaultValue Default value.
	 * @param updateTestData Method to update the data.
	 * @returns The appropriate component.
	 */
	const renderVariable = (
		variable: Variable,
		varIndex: number,
		defaultValue: string,
		updateTestData: (value: string) => void,
	) => {
		switch (variable.type) {
			case VariableType.Text:
				return (
					<Text
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.Binary:
				return (
					<Binary
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.VAS:
				return (
					<VAS
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.Numeric:
				return (
					<Numeric
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
			case VariableType.Qualitative:
				return (
					<Qualitative
						key={varIndex}
						variable={variable}
						defaultValue={defaultValue}
						onChange={updateTestData}
					/>
				);
		}
	};

	return (
		<Stack alignItems="center" spacing={3}>
			{test && testData.current ? (
				testData.current.map((dayData, dayIdx) => (
					<LogbookCard
						key={dayIdx}
						startDate={test.beginningDate!}
						idx={dayIdx}
						periodLen={test.periodLen}
					>
						{test.monitoredVariables.map((v, varIdx) => {
							const defaultValue = dayData.data[varIdx].value;
							return renderVariable(
								v,
								varIdx,
								defaultValue,
								updateTestData(dayIdx, varIdx),
							);
						})}
					</LogbookCard>
				))
			) : (
				<Skeleton
					variant="rectangular"
					animation="wave"
					width={'80%'}
					height={'80vh'}
				/>
			)}
		</Stack>
	);
}
