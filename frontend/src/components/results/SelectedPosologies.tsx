import useTranslation from 'next-translate/useTranslation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExportToolbar from './ExportToolbar';
import CustomTooltip from '../common/CustomTooltip';
import PosologyTable from '../common/table/posologyTable';
import { SubstancePosology } from '../../entities/posology';

interface SelectedPosologiesProps {
	posologies: SubstancePosology[];
}

/**
 * Component to display the posologies tables for all substances.
 */
export default function SelectedPosologies({
	posologies,
}: SelectedPosologiesProps) {
	const { t } = useTranslation('common');

	const xlsxHeaders = (unit: string) => [
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
		<Accordion disableGutters TransitionProps={{ unmountOnExit: true }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ pl: 0 }}>
				<Typography variant="h5">
					{t('results:title.selected-posologies')}
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ padding: 0 }}>
				<Stack spacing={2}>
					{posologies.map(({ substance, unit, posology }, index) => (
						<div key={`substance-posology-${index}`}>
							<Typography fontStyle="italic" fontWeight="bold" mb={1} pl={1}>
								{substance} :
							</Typography>
							<Paper variant="outlined">
								<ExportToolbar
									data={{
										filename: t('results:xlsx.file-posology-x', { substance }), // filename max length = 31 chars
										rows: posology.posology,
										headers: xlsxHeaders(unit),
									}}
									info={
										<CustomTooltip infoText={t('posology-table.fraction-desc')}>
											<Typography fontStyle="italic">
												{t('posology-table.fraction-info')}
											</Typography>
										</CustomTooltip>
									}
								/>
								<PosologyTable
									posology={posology.posology}
									substanceUnit={unit}
								/>
								<Stack direction="row" alignItems="center" spacing={2}>
									<Radio checked={posology.repeatLast} />
									<Typography>{t('results:posology-repeat')}</Typography>
								</Stack>
							</Paper>
						</div>
					))}
				</Stack>
			</AccordionDetails>
		</Accordion>
	);
}
