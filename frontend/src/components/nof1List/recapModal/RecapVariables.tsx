import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { Variable, VariableType } from '../../../entities/variable';
import useTranslation from 'next-translate/useTranslation';

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

interface RecapVariablesProps {
	variables: Variable[];
}

/**
 * Component rendering all chosen monitored health variables.
 */
export default function RecapVariables({ variables }: RecapVariablesProps) {
	const { t } = useTranslation('createTest');

	const varTableHeaders = [
		t('variables.header-name'),
		t('variables.header-type'),
		t('variables.header-desc'),
		t('variables.header-unit'),
		t('variables.header-min'),
		t('variables.header-max'),
		t('variables.header-values'),
	];

	return (
		<Stack spacing={3}>
			<Typography variant="h5">{t('variables.title')}</Typography>
			<TableContainer>
				<Table sx={{ minWidth: 600 }} size="small">
					<TableHead>
						<TableRow>
							{varTableHeaders.map((header, index) => (
								<TableCell key={`var-header-${index}`} align="center">
									<Typography variant="body1" fontWeight="bold">
										{header}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{variables.map((variable, index) => (
							// iterate over object properties does not guarantee right ordering
							<TableRow key={variable.name}>
								{renderTableCell(variable.name)}
								{renderTableCell(variable.type)}
								{renderTableCell(variable.desc)}
								{renderTableCell(variable.unit)}
								{renderTableCell(variable.min)}
								{renderTableCell(variable.max)}
								{renderTableCell(variable.values)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
}
