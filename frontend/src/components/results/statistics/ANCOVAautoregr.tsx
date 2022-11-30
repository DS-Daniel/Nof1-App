import StatsTable, { renderTableCell, StatsTableProps } from './StatsTable';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function ANCOVAautoregr({ substances, stats }: StatsTableProps) {
	const header = ['Slope', 'Intercept', 'Correlation'];
	const autoregrInfoTop = (
		<>
			<TableRow>
				<TableCell component="th" scope="row">
					<Typography variant="body2" fontWeight="bold">
						{'Autoregression'}
					</Typography>
				</TableCell>
				{header.map((h) => (
					<TableCell key={h} sx={{ border: 1.2 }}>
						<Typography variant="body2" align="center" fontWeight="bold">
							{h}
						</Typography>
					</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell component="th" scope="row"></TableCell>
				{renderTableCell(stats.meta!.slope)}
				{renderTableCell(stats.meta!.intercept)}
				{renderTableCell(stats.meta!.corr)}
			</TableRow>
		</>
	);
	const autoregrInfoCenter = (
		<TableRow>
			<TableCell component="th" scope="row">
				<Typography variant="body2" fontWeight="bold">
					{'Autoregression'}
				</Typography>
			</TableCell>
			{renderTableCell(stats.autoregr!.SS)}
			{renderTableCell(stats.autoregr!.DF)}
			{renderTableCell(stats.autoregr!.MS)}
			{renderTableCell(stats.autoregr!.F)}
			{renderTableCell(stats.autoregr!.P)}
		</TableRow>
	);

	return (
		<StatsTable
			substances={substances}
			stats={stats}
			additionalInfoTop={autoregrInfoTop}
			additionalInfoCenter={autoregrInfoCenter}
		/>
	);
}
