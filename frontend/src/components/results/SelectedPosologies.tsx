import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import Radio from '@mui/material/Radio';
import { SubstancePosology } from '../../entities/posology';
import ExportToolbar from './ExportToolbar';
import Paper from '@mui/material/Paper';

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

interface Props {
	posologies: SubstancePosology[];
}

/**
 * Component to display the tables of posologies for all substances.
 */
export default function SelectedPosologies({ posologies }: Props) {
	const { t } = useTranslation('common');

	const headers = [
		t('posology-table.day'),
		t('posology-table.morning'),
		t('posology-table.fraction'),
		t('posology-table.noon'),
		t('posology-table.fraction'),
		t('posology-table.evening'),
		t('posology-table.fraction'),
		t('posology-table.night'),
		t('posology-table.fraction'),
	];

	return (
		<>
			{posologies.map(({ substance, posology }, index) => (
				<Stack key={`substance-posology-${index}`} spacing={1}>
					<Typography fontStyle="italic" fontWeight="bold">
						{substance} :
					</Typography>
					<Paper>
						<ExportToolbar
							data={{
								filename: t('results:xlsx-posology-sub-x', { substance }), // filename max length = 31 chars
								rows: posology.posology,
								headers,
							}}
						/>
						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										{headers.map((header, index) => (
											<TableCell
												key={`posology-header-${index}`}
												align="center"
											>
												<Typography variant="body1" fontWeight="bold">
													{header}
												</Typography>
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{posology.posology.map((row, index) => (
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
						<Stack direction="row" alignItems="center" spacing={2}>
							<Radio checked={posology.repeatLast} />
							<Typography>{t('results:posology-repeat')}</Typography>
						</Stack>
					</Paper>
				</Stack>
			))}
		</>
	);
}
