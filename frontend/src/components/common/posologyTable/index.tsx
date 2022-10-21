import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { PosologyDay } from '../../../entities/posology';
import PosologyHead from './PosologyHead';

/**
 * Helper method to render a TableCell component.
 * @param value Cell content.
 * @returns The TableCell component.
 */
const renderTableCell = (value: number) => {
	return (
		<TableCell align="center">
			<Typography variant="body2">{value}</Typography>
		</TableCell>
	);
};

interface PosologyTableProps {
	posology: PosologyDay[];
	substanceUnit: string;
}

/**
 * Component to display the tables of posologies for all substances.
 */
export default function PosologyTable({
	posology,
	substanceUnit,
}: PosologyTableProps) {
	return (
		<TableContainer
			sx={{
				borderRadius: (theme) =>
					`${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
			}}
			// sx={{ borderRadius: '8px 8px 0 0' }}
		>
			<Table
				size="small"
				// sx={{ minWidth: 600 }}
			>
				<PosologyHead substanceUnit={substanceUnit} />
				<TableBody>
					{posology.map((row, index) => (
						// iterate over object properties does not guarantee right ordering
						<TableRow key={index}>
							{renderTableCell(row.day)}
							{renderTableCell(row.morning)}
							{renderTableCell(row.morningFraction)}
							{renderTableCell(row.noon)}
							{renderTableCell(row.noonFraction)}
							{renderTableCell(row.evening)}
							{renderTableCell(row.eveningFraction)}
							{renderTableCell(row.night)}
							{renderTableCell(row.nightFraction)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
