import useTranslation from 'next-translate/useTranslation';
import PosologyTable from '../../common/table/posologyTable';
import { SubstancePosologies } from '../../../entities/posology';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';

interface RecapPosologiesProps {
	allPosologies: SubstancePosologies[];
}

/**
 * Component rendering all substances posologies.
 */
export default function RecapPosologies({
	allPosologies,
}: RecapPosologiesProps) {
	const { t } = useTranslation('createTest');

	return (
		<Accordion disableGutters TransitionProps={{ unmountOnExit: true }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="h5">
					{t('parameters.subtitle-posology')}
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ pt: 0 }}>
				{allPosologies.map(({ substance, unit, posologies }, index) => (
					<Stack key={`substance-posology-${index}`} spacing={1} pt={2}>
						<Typography variant="h6">
							{t('parameters.substance-x', { substance })}
						</Typography>

						{posologies.map(({ posology, repeatLast }, idx) => (
							<Box key={`substance-posology-data-${idx}`}>
								<Typography mb={1}>
									{t('parameters.posology-x', { x: idx + 1 })}
								</Typography>
								<PosologyTable posology={posology} substanceUnit={unit} />
								<Stack direction="row" alignItems="center" spacing={2}>
									<Radio checked={repeatLast} disableRipple />
									<Typography>
										{t('parameters.posology-repeat-switch')}
									</Typography>
								</Stack>
							</Box>
						))}
					</Stack>
				))}
			</AccordionDetails>
		</Accordion>
	);
}
