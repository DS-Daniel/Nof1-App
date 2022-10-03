import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import ReadOnlyTableWPages from '../common/ReadOnlyTableWPages';
import ExportToolbar from '../../components/results/ExportToolbar';
import { Variable } from '../../entities/variable';

/**
 * Helper method to render a TableCell component.
 * @param idx Index for the key property of list element.
 * @param value Cell value.
 * @returns The TableCell component.
 */
const renderTableCell = (idx: number, value: string) => {
	return (
		<TableCell key={idx} align="center">
			<Typography variant="body2">{value}</Typography>
		</TableCell>
	);
};

/**
 * Generate the row of the table.
 * @param data Cells data.
 * @param variablesNames Array of variable names.
 * @returns An array of table row (TableCell array).
 */
const generateRows = (data: any[], variablesNames: string[]) => {
	return data.map((row, idx) => {
		const rows = [
			renderTableCell(idx++, row.date),
			renderTableCell(idx++, row.substance),
		];
		variablesNames.forEach((name) =>
			rows.push(renderTableCell(idx++, row[name])),
		);
		return rows;
	});
};

interface Props {
	data: any[];
	variables: Variable[];
}

/**
 * Table component to display the patient's health variables data.
 */
export default function PatientDataTable({ data, variables }: Props) {
	const { t } = useTranslation('common');
	const variablesNames = variables.map((v) => v.name);
	const headers = [t('date'), t('substance'), ...variablesNames];
	// filename of the XLSX export. Max length = 31 chars
	const filename = t('results:xlsx-patient-data');

	return (
		<>
			<ExportToolbar
				data={{
					filename,
					rows: data,
					headers,
				}}
			/>
			<ReadOnlyTableWPages
				headers={headers}
				rows={generateRows(data, variablesNames)}
				emptyCellHeight={33}
			/>
		</>
	);
}
