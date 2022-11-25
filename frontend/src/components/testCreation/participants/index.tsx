import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { MutableRefObject } from 'react';
import { IParticipants } from '../../../entities/nof1Test';
import {
	formatPatientDataToForm,
	formatPhysicianDataToForm,
} from '../../../utils/dataFormConvertor';
import PatientForm from './PatientForm';
import PharmaForm from './PharmaForm';
import PhysicianForm from './PhysicianForm';

interface ParticipantsProps {
	participants: MutableRefObject<IParticipants>;
}

/**
 * Participants section component. Render forms for each participant.
 */
export default function Participants({ participants }: ParticipantsProps) {
	const { t } = useTranslation('createTest');

	return (
		<Paper sx={{ p: 3, width: '100%' }}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h5" fontWeight="bold">
						{t('participants.title')}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<PatientForm
						participants={participants}
						defaultValues={formatPatientDataToForm(
							participants.current.patient,
						)}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<PhysicianForm
						participants={participants}
						defaultValues={formatPhysicianDataToForm(
							participants.current.requestingPhysician,
						)}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<PharmaForm participants={participants} />
				</Grid>
			</Grid>
		</Paper>
	);
}
