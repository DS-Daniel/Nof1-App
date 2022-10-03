import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Variable, VariableType } from '../../../entities/variable';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

/**
 * Helper method to render a TableCell component.
 * @param name Cell content.
 * @returns The TableCell component.
 */
const renderTableCell = (name: string | number | VariableType | undefined) => {
	return (
		<TableCell align="center">
			<Typography variant="body2">{name}</Typography>
		</TableCell>
	);
};

type VarTableProps = {
	rows: Variable[];
	removeRow: (idx: number) => void;
};

/**
 * Table component for health variables.
 */
export default function VarTable({ rows, removeRow }: VarTableProps) {
	const { t } = useTranslation('createTest');
	const headers = [
		t('variables.header-name'),
		t('variables.header-type'),
		t('variables.header-desc'),
		t('variables.header-unit'),
		t('variables.header-min'),
		t('variables.header-max'),
		t('variables.header-values'),
		'',
	];

	return (
		<Box sx={{ width: '100%', my: '2rem' }}>
			<TableContainer>
				<Table
					sx={{ minWidth: 600 }}
					aria-labelledby="tableTitle"
					size="medium"
				>
					<TableHead>
						<TableRow>
							{headers.map((header, index) => (
								<TableCell key={`var-header-${index}`} align="center">
									<Typography variant="body1">{header}</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((variable, index) => (
							// iterate over object properties does not guarantee right ordering
							<TableRow key={variable.name}>
								{renderTableCell(variable.name)}
								{renderTableCell(variable.type)}
								{renderTableCell(variable.desc)}
								{renderTableCell(variable.unit)}
								{renderTableCell(variable.min)}
								{renderTableCell(variable.max)}
								{renderTableCell(variable.values)}
								<TableCell align="center">
									<IconButton
										color="error"
										aria-label="delete"
										onClick={() => removeRow(index)}
									>
										<DeleteForeverIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
