import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import {
	usePatientSchema,
	PatientFormData,
} from '../../../utils/zodValidationHook';
import FormWithValidation from '../../common/FormWithValidation';
import { Patient } from '../../../entities/people';
import { MutableRefObject, useState } from 'react';
import { formatPatientData } from '../../../utils/dataFormConvertor';
import {
	createPatient,
	findPatient,
	updatePatient,
} from '../../../utils/apiCalls';
import isEqual from 'lodash.isequal';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';
import { useUserContext } from '../../../context/UserContext';

type PatientFormProps = {
	patient: MutableRefObject<Patient>;
	defaultValues: PatientFormData;
};

/**
 * Component that manages and renders the patient form.
 */
export default function PatientForm({
	patient,
	defaultValues,
}: PatientFormProps) {
	const { t } = useTranslation('common');
	const { userContext } = useUserContext();
	const schema = usePatientSchema();
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);

	// form inputs data.
	const inputs = [
		{ name: 'firstname', trad: t('form.firstname'), size: 6 },
		{ name: 'lastname', trad: t('form.lastname'), size: 6 },
		{ name: 'phone', trad: t('form.phone') },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 4 },
		{ name: 'city', trad: t('form.city'), size: 8 },
		{ name: 'email', trad: t('form.email') },
		{ name: 'insurance', trad: t('form.insurance'), size: 5.5 },
		{ name: 'insuranceNb', trad: t('form.insuranceNb'), size: 6.5 },
	];

	/**
	 * Handle the form submit. It checks if the data has changed and triggers 
	 * a patient creation or update if he already exists. It also triggers
	 * success or failure snackbar.
	 * @param data Data from the form.
	 */
	const handleSubmit = async (data: PatientFormData) => {
		const newPatient = formatPatientData(data);
		let creationError = false;
		let updateError = false;
		if (!isEqual(patient.current, newPatient)) {
			const patientInDB = await findPatient(
				userContext.access_token,
				newPatient.email,
			);
			if (!patientInDB) {
				// new patient
				const { response, statusCode } = await createPatient(
					userContext.access_token,
					newPatient,
				);
				creationError = statusCode !== 201;
				newPatient._id = response._id; // undefined if not present
			} else {
				newPatient._id = patientInDB._id;
				if (!isEqual(patientInDB, newPatient)) {
					// update information in DB if needed
					const { statusCode } = await updatePatient(
						userContext.access_token,
						patientInDB._id!,
						newPatient,
					);
					updateError = statusCode !== 200;
				}
			}
		}
		if (creationError || updateError) {
			setOpenFailSnackbar(true);
		} else {
			patient.current = newPatient;
			setOpenSuccessSnackbar(true);
		}
	};

	return (
		<Paper sx={{ p: 2, width: '100%' }}>
			<Typography variant="h6">
				{t('createTest:participants.patientInfo')}
			</Typography>
			<FormWithValidation<PatientFormData>
				schema={schema}
				inputs={inputs}
				btnLabel={t('button.saveDataBtn')}
				errorMsg={t('formErrors.errorMsg')}
				onSubmit={handleSubmit}
				defaultValues={defaultValues}
			/>
			<SuccessSnackbar
				open={openSuccessSnackbar}
				setOpen={setOpenSuccessSnackbar}
				msg={t('formErrors.successMsg')}
			/>
			<FailSnackbar
				open={openFailSnackbar}
				setOpen={setOpenFailSnackbar}
				msg={t('formErrors.unexpectedErrorMsg')}
			/>
		</Paper>
	);
}
