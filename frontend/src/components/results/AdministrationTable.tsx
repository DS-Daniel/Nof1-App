import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { AdministrationSchema } from '../../entities/nof1Test';
import ReadOnlyTableWPages from '../common/table/ReadOnlyTableWPages';
import ExportToolbar from '../../components/results/ExportToolbar';

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
 * @param schema Administration schema.
 * @returns An array of table row (TableCell array).
 */
const generateRows = (schema: AdministrationSchema) => {
	return schema.map((row, idx) => [
		// using idx for key properties (of list of elements)
		renderTableCell(idx, row.date),
		renderTableCell(++idx, row.substance),
		renderTableCell(++idx, row.morning.toString()),
		renderTableCell(++idx, row.morningFraction.toString()),
		renderTableCell(++idx, row.noon.toString()),
		renderTableCell(++idx, row.noonFraction.toString()),
		renderTableCell(++idx, row.evening.toString()),
		renderTableCell(++idx, row.eveningFraction.toString()),
		renderTableCell(++idx, row.night.toString()),
		renderTableCell(++idx, row.nightFraction.toString()),
		renderTableCell(++idx, row.unit),
	]);
};

interface Props {
	administrationSchema: AdministrationSchema;
}

/**
 * Table component to display the administration schema.
 */
export default function AdministrationTable({ administrationSchema }: Props) {
	const { t } = useTranslation('common');
	const headers = [
		t('date'),
		t('substance'),
		t('posology-table.morning'),
		t('posology-table.fraction'),
		t('posology-table.noon'),
		t('posology-table.fraction'),
		t('posology-table.evening'),
		t('posology-table.fraction'),
		t('posology-table.night'),
		t('posology-table.fraction'),
		t('measure-unit-label'),
	];
	// filename of the XLSX export. Max length = 31 chars
	const filename = t('results:xlsx-admin-schema');

	return (
		<>
			<ExportToolbar
				data={{
					filename,
					rows: administrationSchema,
					headers,
				}}
			/>
			<ReadOnlyTableWPages
				headers={headers}
				rows={generateRows(administrationSchema)}
				emptyCellHeight={33}
			/>
		</>
	);
}
