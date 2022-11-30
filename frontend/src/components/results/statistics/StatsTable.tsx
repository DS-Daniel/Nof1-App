import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { Stats } from '../../../utils/statistics';

/**
 * Helper method to render a TableCell component.
 * @param val Cell content.
 * @returns The TableCell component.
 */
export const renderTableCell = (val: string | number | undefined) => {
	return (
		<TableCell align="right" sx={{ borderLeft: 1, borderRight: 1 }}>
			<Typography variant="body2">{val}</Typography>
		</TableCell>
	);
};

export interface StatsTableProps {
	substances: string[];
	stats: Stats;
	additionalInfoTop?: JSX.Element;
	additionalInfoCenter?: JSX.Element;
}

export default function StatsTable({
	substances,
	stats,
	additionalInfoTop,
	additionalInfoCenter,
}: StatsTableProps) {
	const { t } = useTranslation('results');
	const statsHeader = ['SS', 'df', 'MS', 'F', 'p'];

	return (
		<TableContainer>
			<Table size="small">
				<TableBody>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.treatment')}
							</Typography>
						</TableCell>
						{substances.map((s) => (
							<TableCell key={s}>
								<Typography variant="body2" fontWeight="bold">
									{s}
								</Typography>
							</TableCell>
						))}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2">
								{t('statistics.treat-effect')}
							</Typography>
						</TableCell>
						{stats.treatment.effect.map((e, idx) => (
							<TableCell key={`treat-effect-${idx}`}>
								<Typography variant="body2">{e}</Typography>
							</TableCell>
						))}
					</TableRow>
					{additionalInfoTop}
					<TableRow>
						<TableCell component="th" scope="row"></TableCell>
						{statsHeader.map((e) => (
							<TableCell key={e} align="center" sx={{ border: 1.2 }}>
								<Typography variant="body2" fontWeight="bold">
									{e}
								</Typography>
							</TableCell>
						))}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.treatment')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.treatment.SS)}
						{renderTableCell(stats.treatment.DF)}
						{renderTableCell(stats.treatment.MS)}
						{renderTableCell(stats.treatment.F)}
						{renderTableCell(stats.treatment.P)}
					</TableRow>
					{additionalInfoCenter}
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.residual')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.residual.SS)}
						{renderTableCell(stats.residual.DF)}
						{renderTableCell(stats.residual.MS)}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2" fontWeight="bold">
								{t('statistics.total')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.total.SS)}
						{renderTableCell(stats.total.DF)}
						{renderTableCell(stats.total.MS)}
					</TableRow>
					<TableRow>
						<TableCell component="th" scope="row">
							<Typography variant="body2">
								{t('statistics.total-mean')}
							</Typography>
						</TableCell>
						{renderTableCell(stats.total.mean)}
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
