import useTranslation from 'next-translate/useTranslation';
import ReadOnlyTableWPages from '../common/table/ReadOnlyTableWPages';
import ExportToolbar from '../../components/results/ExportToolbar';
import { Variable } from '../../entities/variable';

interface Props {
	data: string[][];
	variables: Variable[];
}

/**
 * Table component to display the patient's health variables data.
 */
export default function PatientDataTable({ data, variables }: Props) {
	const { t } = useTranslation('results');
	const variablesNames = variables.map((v) => v.name);
	const headers = [
		t('common:date'),
		t('common:substance'),
		t('data-table.supposition'),
		t('data-table.optimal'),
		t('data-table.remark'),
		...variablesNames,
	];
	// filename of the XLSX export. Max length = 31 chars
	const filename = t('xlsx.file-patient-data');

	return (
		<>
			<ExportToolbar
				data={{
					filename,
					rows: data,
					headers: [headers],
				}}
			/>
			<ReadOnlyTableWPages headers={headers} rows={data} emptyCellHeight={33} />
		</>
	);
}
