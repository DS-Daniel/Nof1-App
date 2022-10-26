import Grid from '@mui/material/Grid';
import ReadOnlyForm from '../../common/ReadOnlyForm';
import useTranslation from 'next-translate/useTranslation';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Patient, Physician } from '../../../entities/people';

interface RecapParticipantsProps {
	patient: Patient;
	physician: Physician;
	pharmaEmail: string;
}

/**
 * Component rendering the information of the test's participants.
 */
export default function RecapParticipants({
	patient,
	physician,
	pharmaEmail,
}: RecapParticipantsProps) {
	const { t } = useTranslation('common');

	const patientInputs = [
		{
			name: 'firstname',
			value: patient.firstname,
			label: t('form.firstname'),
			size: 6,
		},
		{
			name: 'lastname',
			value: patient.lastname,
			label: t('form.lastname'),
			size: 6,
		},
		{ name: 'phone', value: patient.phone, label: t('form.phone') },
		{ name: 'email', value: patient.email, label: t('form.email') },
		{
			name: 'birthYear',
			value: patient.birthYear,
			label: t('form.birth-year'),
			size: 5,
		},
		{
			name: 'country',
			value: patient.address.country,
			label: t('form.country'),
			size: 7,
		},
		{
			name: 'street',
			value: patient.address.street,
			label: t('form.street'),
		},
		{
			name: 'zip',
			value: patient.address.zip,
			label: t('form.zip'),
			size: 5,
		},
		{
			name: 'city',
			value: patient.address.city,
			label: t('form.city'),
			size: 7,
		},
		{
			name: 'insurance',
			value: patient.insurance,
			label: t('form.insurance'),
		},
		{
			name: 'insuranceNb',
			value: patient.insuranceNb,
			label: t('form.insuranceNb'),
		},
	];

	const physicianInputs = [
		{
			name: 'firstname',
			value: physician.firstname,
			label: t('form.firstname'),
			size: 6,
		},
		{
			name: 'lastname',
			value: physician.lastname,
			label: t('form.lastname'),
			size: 6,
		},
		{ name: 'phone', value: physician.phone, label: t('form.phone') },
		{ name: 'email', value: physician.email, label: t('form.email') },
		{
			name: 'country',
			value: physician.address.country,
			label: t('form.country'),
		},
		{
			name: 'street',
			value: physician.address.street,
			label: t('form.street'),
		},
		{
			name: 'zip',
			value: physician.address.zip,
			label: t('form.zip'),
			size: 5,
		},
		{
			name: 'city',
			value: physician.address.city,
			label: t('form.city'),
			size: 7,
		},
		{
			name: 'institution',
			value: physician.institution,
			label: t('form.institution'),
		},
	];

	const pharmaInputs = [
		{ name: 'email', value: pharmaEmail, label: t('form.email') },
	];

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h5">
					{t('createTest:participants.title')}
				</Typography>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Paper sx={{ p: 2, width: '100%' }}>
					<Typography variant="h6">
						{t('createTest:participants.patientInfo')}
					</Typography>
					<ReadOnlyForm inputs={patientInputs} />
				</Paper>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Paper sx={{ p: 2, width: '100%' }}>
					<Typography variant="h6">
						{t('createTest:participants.physicianInfo')}
					</Typography>
					<ReadOnlyForm inputs={physicianInputs} />
				</Paper>
			</Grid>
			<Grid item xs={12} sm={4}>
				<Paper sx={{ p: 2, width: '100%' }}>
					<Typography variant="h6">
						{t('createTest:participants.pharmaEmail')}
					</Typography>
					<ReadOnlyForm inputs={pharmaInputs} />
				</Paper>
			</Grid>
		</Grid>
	);
}
