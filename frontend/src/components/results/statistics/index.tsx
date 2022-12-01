import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import CycleANOVA from './CycleANOVA';
import StatsTable from './StatsTable';
import ANCOVAautoregr from './ANCOVAautoregr';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { VariableType } from '../../../entities/variable';
import { AnalyseType, anova, isAnalyseValid } from '../../../utils/statistics';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
	// TODO
	// const [statsType, setStatsType] = useState<AnalyseType>(test.statistics);
	const [statsType, setStatsType] = useState<AnalyseType>(
		AnalyseType.NaiveANOVA,
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
			return <Typography>{t('statistics.error')}</Typography>;

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
	 * Selects a traduction according to the type of analysis.
	 * @param type Analysis type
	 * @returns The traduction string.
	 */
	const selectTrad = (type: AnalyseType) => {
		switch (type) {
			case AnalyseType.NaiveANOVA:
				return t('statistics.NaiveANOVA');
			case AnalyseType.CycleANOVA:
				return t('statistics.CycleANOVA');
			case AnalyseType.ANCOVAautoregr:
				return t('statistics.ANCOVAautoregr');
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
				subtitle = t('statistics.NaiveANOVA-long');
				desc = t('statistics.NaiveANOVA-desc');
				break;
			case AnalyseType.CycleANOVA:
				subtitle = t('statistics.CycleANOVA-long');
				desc = t('statistics.CycleANOVA-desc');
				break;
			case AnalyseType.ANCOVAautoregr:
				subtitle = t('statistics.ANCOVAautoregr-long');
				desc = t('statistics.ANCOVAautoregr-desc');
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

	return (
		<div>
			<Select
				id="statistic-type"
				size="small"
				value={statsType}
				onChange={(e) => setStatsType(e.target.value as AnalyseType)}
			>
				{Object.values(AnalyseType).map((t) => (
					<MenuItem key={t} value={t}>
						{selectTrad(t)}
					</MenuItem>
				))}
			</Select>
			{renderDesc(statsType)}
			{/* statistical analysis only on quantitative variables */}
			{test.monitoredVariables
				.filter(
					(v) => v.type === VariableType.Numeric || v.type === VariableType.VAS,
				)
				.map((v) => (
					<Stack key={v.name} spacing={1} my={2}>
						<Typography
							variant="subtitle1"
							fontStyle="italic"
							fontWeight="bold"
						>
							{t('statistics.var-analyse', { variable: v.name })}
						</Typography>
						<Typography>
							{t('createTest:variables.header.skip')} :{' '}
							{v.skippedRunInDays ?? 0}
						</Typography>
						{renderStatisticTable({
							name: v.name,
							skippedRunInDays: v.skippedRunInDays ?? 0,
						})}
					</Stack>
				))}
		</div>
	);
}
