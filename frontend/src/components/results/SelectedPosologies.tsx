import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import Radio from '@mui/material/Radio';
import { SubstancePosology } from '../../entities/posology';
import ExportToolbar from './ExportToolbar';
import Paper from '@mui/material/Paper';
import PosologyTable from '../common/table/posologyTable';

interface SelectedPosologiesProps {
	posologies: SubstancePosology[];
}

/**
 * Component to display the tables of posologies for all substances.
 */
export default function SelectedPosologies({
	posologies,
}: SelectedPosologiesProps) {
	const { t } = useTranslation('common');

	const headers = (unit: string) => [
		t('posology-table.day'),
		t('posology-table.dose', { unit }) + ' ' + t('posology-table.morning'),
		t('posology-table.fraction'),
		t('posology-table.dose', { unit }) + ' ' + t('posology-table.noon'),
		t('posology-table.fraction'),
		t('posology-table.dose', { unit }) + ' ' + t('posology-table.evening'),
		t('posology-table.fraction'),
		t('posology-table.dose', { unit }) + ' ' + t('posology-table.night'),
		t('posology-table.fraction'),
	];

	return (
		<>
			{posologies.map(({ substance, unit, posology }, index) => (
				<Stack key={`substance-posology-${index}`} spacing={1}>
					<Typography fontStyle="italic" fontWeight="bold">
						{substance} :
					</Typography>
					<Paper>
						<ExportToolbar
							data={{
								filename: t('results:xlsx-posology-sub-x', { substance }), // filename max length = 31 chars
								rows: posology.posology,
								headers: headers(unit),
							}}
						/>
						<PosologyTable posology={posology.posology} substanceUnit={unit} />
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
