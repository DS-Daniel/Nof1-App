import StatsTable, { renderTableCell, StatsTableProps } from './StatsTable';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function CycleANOVA({ substances, stats }: StatsTableProps) {
	const cycleInfo = (
		<>
			<TableRow>
				<TableCell component="th" scope="row">
					<Typography variant="body2" fontWeight="bold">
						{'Cycle'}
					</Typography>
				</TableCell>
				{renderTableCell(stats.cycle!.SS)}
				{renderTableCell(stats.cycle!.DF)}
				{renderTableCell(stats.cycle!.MS)}
				{renderTableCell(stats.cycle!.F)}
				{renderTableCell(stats.cycle!.P)}
			</TableRow>
			<TableRow>
				<TableCell component="th" scope="row">
					<Typography variant="body2" fontWeight="bold">
						{'Treatment x Cycle'}
					</Typography>
				</TableCell>
				{renderTableCell(stats.cycle!.SS)}
				{renderTableCell(stats.cycle!.DF)}
				{renderTableCell(stats.cycle!.MS)}
			</TableRow>
		</>
	);

	return (
		<StatsTable
			substances={substances}
			stats={stats}
			additionalInfoCenter={cycleInfo}
		/>
	);
}
