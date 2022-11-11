import useTranslation from 'next-translate/useTranslation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import ExportToolbar from './ExportToolbar';
import CustomTooltip from '../common/CustomTooltip';
import PosologyTable from '../common/table/posologyTable';
import { SubstancePosology } from '../../entities/posology';

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
								filename: t('results:xlsx.file-posology-x', { substance }), // filename max length = 31 chars
								rows: posology.posology,
								headers: headers(unit),
							}}
							info={
								<CustomTooltip infoText={t('posology-table.fraction-desc')}>
									<Typography fontStyle="italic">
										{t('posology-table.fraction-info')}
									</Typography>
								</CustomTooltip>
							}
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
