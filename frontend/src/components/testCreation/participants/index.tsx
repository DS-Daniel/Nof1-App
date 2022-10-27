import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { MutableRefObject } from 'react';
import { Patient, Pharmacy, Physician } from '../../../entities/people';
import {
	formatPatientDataToForm,
	formatPhysicianDataToForm,
} from '../../../utils/dataFormConvertor';
import PatientForm from './PatientForm';
import PharmaForm from './PharmaForm';
import PhysicianForm from './PhysicianForm';

interface ParticipantsProps {
	pharmacy: MutableRefObject<Pharmacy>;
	patient: MutableRefObject<Patient>;
	physician: MutableRefObject<Physician>;
}

/**
 * Participants section component. Renders forms for each participant.
 */
export default function Participants({
	pharmacy,
	patient,
	physician,
}: ParticipantsProps) {
	const { t } = useTranslation('createTest');

	return (
		<Paper sx={{ p: 3, width: '100%' }}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h5" fontWeight="bold">
						{t('participants.title')}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={4}>
					<PatientForm
						patient={patient}
						defaultValues={formatPatientDataToForm(patient.current)}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<PhysicianForm
						physician={physician}
						defaultValues={formatPhysicianDataToForm(physician.current)}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<PharmaForm pharmacy={pharmacy} />
				</Grid>
			</Grid>
		</Paper>
	);
}
