import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import ReadOnlyTableWPages from '../common/table/ReadOnlyTableWPages';
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
 * @returns An array of table row (TableCell array).
 */
const generateRows = (data: (string)[][]) => {
	return data.map((row, idx) => row.map((e) => renderTableCell(idx++, e)));
};

interface Props {
	data: (string)[][];
	variables: Variable[];
}

/**
 * Table component to display the patient's health variables data.
 */
export default function PatientDataTable({ data, variables }: Props) {
	const { t } = useTranslation('common');
	const variablesNames = variables.map((v) => v.name);
	const headers = [
		t('date'),
		t('substance'),
		t('results:data-table.supposition'),
		t('results:data-table.optimal'),
		t('results:data-table.remark'),
		...variablesNames,
	];
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
				rows={generateRows(data)}
				emptyCellHeight={33}
			/>
		</>
	);
}
