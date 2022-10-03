import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileSaver from 'file-saver';
import useTranslation from 'next-translate/useTranslation';
import { useCallback } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useCurrentPng } from 'recharts-to-png';
import { TestData } from '../../entities/nof1Data';
import { Variable } from '../../entities/variable';
import { currentSubstance, formatGraphData } from '../../utils/charts';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Paper from '@mui/material/Paper';
import { Substance } from '../../entities/substance';

interface Props {
	testData: TestData;
	variable: Variable;
	periodLen: number;
	substances: Substance[];
	substancesSeq: string[];
	substancesColors: string[];
}

/**
 * Line chart component, rendering a line chart for the given data.
 */
export function CustomLineChart({
	testData,
	variable,
	periodLen,
	substances,
	substancesSeq,
	substancesColors,
}: Props) {
	const { t } = useTranslation('results');
	const [getPng, { ref }] = useCurrentPng();
	const data = formatGraphData(testData, variable, periodLen);

	/**
	 * Handle click on the download button. It triggers a file save.
	 */
	const handleDownload = useCallback(async () => {
		const png = await getPng();
		if (png) {
			FileSaver.saveAs(png, `${variable.name}.png`);
		}
	}, [getPng, variable.name]);

	/**
	 * CustomTooltip component for the LineChart. Allows to display the correct information.
	 */
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			let correctPayload = payload[0];
			if (label > 1 && (label - 1) % periodLen === 0) {
				correctPayload = payload.find(
					(p: any) =>
						p.dataKey ===
						currentSubstance(label, periodLen, substancesSeq, substances),
				);
			}
			return (
				<Paper variant="outlined" sx={{ padding: 1 }}>
					<Typography>{`${t('common:day')} ${label}`}</Typography>
					<Typography>{`${correctPayload.dataKey} : ${correctPayload.value}`}</Typography>
				</Paper>
			);
		}
		return null;
	};

	const substancesNames = substances.map((s) => s.name);

	return (
		<Stack alignItems="center">
			<Stack width="90%" direction="row" justifyContent="space-between">
				<Typography variant="h6" fontStyle="italic" fontWeight="bold">
					{variable.name}
				</Typography>
				<Button
					onClick={handleDownload}
					endIcon={<FileDownloadOutlinedIcon />}
					sx={{ justifySelf: 'flex-end' }}
				>
					{t('dl-graph')}
				</Button>
			</Stack>
			<ResponsiveContainer width="80%" height={300}>
				<LineChart
					data={data}
					ref={ref}
					margin={{ top: 5, right: 5, left: 5, bottom: 15 }}
				>
					{substancesNames.map((s, idx) => (
						<Line
							key={s}
							type="monotone"
							dataKey={s}
							stroke={substancesColors[idx]}
						/>
					))}
					<XAxis
						dataKey="day"
						label={{
							value: t('common:days'),
							offset: -1,
							position: 'bottom',
						}}
					/>
					<YAxis
						label={{ value: variable.unit, angle: -90, position: 'insideLeft' }}
						type="number"
						domain={
							Number(variable.min) && Number(variable.max)
								? [Number(variable.min), Number(variable.max)]
								: ['auto', 'auto']
						}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend verticalAlign="top" />
				</LineChart>
			</ResponsiveContainer>
		</Stack>
	);
}
