import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import {
	usePatientSchema,
	PatientFormData,
} from '../../../utils/zodValidationHook';
import FormWithValidation, { FormInput } from '../../common/FormWithValidation';
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
import { IParticipants } from '../../../entities/nof1Test';

type PatientFormProps = {
	participants: MutableRefObject<IParticipants>;
	defaultValues: PatientFormData;
};

/**
 * Component that manages and renders the patient form.
 */
export default function PatientForm({
	participants,
	defaultValues,
}: PatientFormProps) {
	const { t } = useTranslation('common');
	const { userContext } = useUserContext();
	const schema = usePatientSchema();
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);

	// form inputs data.
	const inputs: FormInput[] = [
		{ name: 'firstname', trad: t('form.firstname'), required: true, size: 6 },
		{ name: 'lastname', trad: t('form.lastname'), required: true, size: 6 },
		{ name: 'phone', trad: t('form.phone'), required: true },
		{ name: 'email', trad: t('form.email'), required: true },
		{ name: 'birthYear', trad: t('form.birth-year'), required: true, size: 6 },
		{ name: 'country', trad: t('form.country'), size: 6 },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 5 },
		{ name: 'city', trad: t('form.city'), size: 7 },
		{ name: 'insurance', trad: t('form.insurance'), required: true },
		{ name: 'insuranceNb', trad: t('form.insuranceNb'), required: true },
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
		if (!isEqual(participants.current.patient, newPatient)) {
			if (data._id) {
				delete newPatient._id;
				// remove _id to avoid duplicate key in DB collection.
				// In case the email is changed for an existing patient and
				// a new patient creation is triggered below.
			}
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
			participants.current.patient = newPatient;
			setOpenSuccessSnackbar(true);
		}
	};

	return (
		<Paper sx={{ p: 2, width: '100%' }}>
			<Typography variant="h6">
				{t('createTest:participants.patient')}
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
