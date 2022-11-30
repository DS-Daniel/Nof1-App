import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { AnalyseType, anova } from '../../../utils/statistics';
import CycleANOVA from './CycleANOVA';
import StatsTable from './StatsTable';
import ANCOVAautoregr from './ANCOVAautoregr';
import { Nof1Test } from '../../../entities/nof1Test';
import { TestData } from '../../../entities/nof1Data';
import { VariableType } from '../../../entities/variable';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface StatisticsProps {
	test: Nof1Test;
	testData: TestData;
}

export default function Statistics({ test, testData }: StatisticsProps) {
	const { t } = useTranslation('results');
	// const [statsType, setStatsType] = useState<AnalyseType>(test.statistics);
	const [statsType, setStatsType] = useState<AnalyseType>(
		AnalyseType.NaiveANOVA,
	);
	const substances = test.substances.map((s) => s.name);

	const renderStatisticTable = (variable: {
		name: string;
		skippedRunInDays: number;
	}) => {
		const stats = anova(statsType, variable, test, testData);
		switch (statsType) {
			case AnalyseType.NaiveANOVA:
				return <StatsTable substances={substances} stats={stats} />;
			case AnalyseType.CycleANOVA:
				return <CycleANOVA substances={substances} stats={stats} />;
			case AnalyseType.ANCOVAautoregr:
				return <ANCOVAautoregr substances={substances} stats={stats} />;
		}
	};

	return (
		<>
			<Select
				id="statistic-type"
				size="small"
				value={statsType}
				onChange={(e) => setStatsType(e.target.value as AnalyseType)}
			>
				{Object.values(AnalyseType).map((t) => (
					<MenuItem key={t} value={t}>
						{t}
					</MenuItem>
				))}
			</Select>
			{test.monitoredVariables
				.filter(
					(v) => v.type === VariableType.Numeric || v.type === VariableType.VAS,
				)
				.map((v) => (
					<Stack key={v.name} spacing={1} my={2}>
						<Typography variant="h6" fontStyle="italic" fontWeight="bold">
							{t('statistics.var-analyse', { variable: v.name })}
						</Typography>
						{renderStatisticTable({
							name: v.name,
							skippedRunInDays: v.skippedRunInDays!,
						})}
					</Stack>
				))}
		</>
	);
}
