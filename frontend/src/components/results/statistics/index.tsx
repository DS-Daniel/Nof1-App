import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import CycleANOVA from './CycleANOVA';
import StatsTable from './StatsTable';
import ANCOVAautoregr from './ANCOVAautoregr';
import SelectAnalysisType from '../../common/inputs/SelectAnalysisType';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { VariableType } from '../../../entities/variable';
import { AnalyseType, anova, isAnalyseValid } from '../../../utils/statistics';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface StatisticsProps {
	test: Nof1Test;
	testData: TestData;
}

/**
 * Component rendering the statistical analysis on the N-of-1 data.
 */
export default function Statistics({ test, testData }: StatisticsProps) {
	const { t } = useTranslation('results');
	const [statsType, setStatsType] = useState<AnalyseType>(
		test.statistics.analysisToPerform,
	);
	const substances = test.substances.map((s) => s.name);

	/**
	 * Renders the statistical analysis table of the given variable.
	 * @param variable Variable.
	 * @returns The statistical analysis table component.
	 */
	const renderStatisticTable = (variable: {
		name: string;
		skippedRunInDays: number;
	}) => {
		const stats = anova(statsType, variable, test, testData);
		// if statistics contain NaN values due to incomplete patient's data,
		// an error message is displayed.
		if (!isAnalyseValid(stats))
			return (
				<Typography fontWeight="bold" fontStyle="italic" color="error">
					{t('statistics.error')}
				</Typography>
			);

		switch (statsType) {
			case AnalyseType.NaiveANOVA:
				return <StatsTable substances={substances} stats={stats} />;
			case AnalyseType.CycleANOVA:
				return <CycleANOVA substances={substances} stats={stats} />;
			case AnalyseType.ANCOVAautoregr:
				return <ANCOVAautoregr substances={substances} stats={stats} />;
		}
	};

	/**
	 * Renders an analysis description according to the type of analysis.
	 * @param type Analysis type
	 * @returns The description component.
	 */
	const renderDesc = (type: AnalyseType) => {
		let subtitle: string, desc: string;
		switch (type) {
			case AnalyseType.NaiveANOVA:
				subtitle = t('common:statistics.NaiveANOVA-long');
				desc = t('common:statistics.NaiveANOVA-desc');
				break;
			case AnalyseType.CycleANOVA:
				subtitle = t('common:statistics.CycleANOVA-long');
				desc = t('common:statistics.CycleANOVA-desc');
				break;
			case AnalyseType.ANCOVAautoregr:
				subtitle = t('common:statistics.ANCOVAautoregr-long');
				desc = t('common:statistics.ANCOVAautoregr-desc');
				break;
		}
		return (
			<>
				<Typography variant="subtitle1" fontWeight="bold" mt={2}>
					{subtitle}
				</Typography>
				<Typography>{desc}</Typography>
			</>
		);
	};

	/**
	 * Checks if patient data is complete, if not issues a warning.
	 * @param varName Variable's name.
	 * @returns A warning message if data is not complete.
	 */
	const renderWarning = (varName: string) => {
		const notComplete = testData.some((d) => {
			const v = d.data.find((v) => v.variableName === varName);
			return v?.value === '';
		});
		return (
			notComplete && (
				<Typography fontWeight="bold" fontStyle="italic" color="error">
					{t('statistics.warning')}
				</Typography>
			)
		);
	};

	return (
		<div>
			<SelectAnalysisType
				value={statsType}
				onChange={(e) => setStatsType(e.target.value as AnalyseType)}
			/>
			{renderDesc(statsType)}
			{/* statistical analysis only on quantitative variables */}
			{test.monitoredVariables
				.filter(
					(v) => v.type === VariableType.Numeric || v.type === VariableType.VAS,
				)
				.map((v) => (
					<Stack key={v.name} spacing={1} my={2}>
						<Typography variant="subtitle1" fontWeight="bold">
							{t('statistics.var-analyse', { variable: v.name })}
						</Typography>
						<Typography>
							{t('createTest:variables.header.skip')} :{' '}
							{v.skippedRunInDays ?? 0}
						</Typography>
						{renderWarning(v.name)}
						{renderStatisticTable({
							name: v.name,
							skippedRunInDays: v.skippedRunInDays ?? 0,
						})}
					</Stack>
				))}
		</div>
	);
}
