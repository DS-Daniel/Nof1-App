import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
	usePhysicianSchema,
	PhysicianFormData,
} from '../../../utils/zodValidationHook';
import {
	formatPhysicianData,
	formatPhysicianDataToForm,
} from '../../../utils/dataFormConvertor';
import {
	createPhysician,
	findPhysician,
	updatePhysician,
} from '../../../utils/apiCalls';
import { isPhysicianInfoEqual } from '../../../utils/nof1-lib/lib';
import FormWithValidation, { FormInput } from '../../common/FormWithValidation';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';
import { useUserContext } from '../../../context/UserContext';
import { Physician } from '../../../entities/people';

type PhysicianFormProps = {
	header: string;
	physician: () => Physician;
	setPhysician: (physician: Physician) => void;
};

/**
 * Component that manages and renders the physician form.
 */
export default function PhysicianForm({
	header,
	physician,
	setPhysician,
}: PhysicianFormProps) {
	const { t } = useTranslation('common');
	const { userContext } = useUserContext();
	const schema = usePhysicianSchema();
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);

	// form inputs data.
	const inputs: FormInput[] = [
		{ name: 'firstname', trad: t('form.firstname'), required: true, size: 6 },
		{ name: 'lastname', trad: t('form.lastname'), required: true, size: 6 },
		{ name: 'phone', trad: t('form.phone'), required: true },
		{ name: 'email', trad: t('form.email'), required: true },
		{ name: 'country', trad: t('form.country') },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 5 },
		{ name: 'city', trad: t('form.city'), size: 7 },
		{ name: 'institution', trad: t('form.institution'), required: true },
	];

	/**
	 * Handle the form submit. It checks if the data has changed and triggers
	 * a physician creation or update if he already exists. It also triggers
	 * success or failure snackbar.
	 * @param data Data from the form.
	 */
	const handleSubmit = async (data: PhysicianFormData) => {
		const newPhysician = formatPhysicianData(data);
		let creationError = false;
		let updateError = false;
		if (!isPhysicianInfoEqual(physician(), newPhysician)) {
			// check existence to determine an update or a creation.
			const physicianInDB = await findPhysician(
				userContext.access_token,
				newPhysician.email,
			);
			if (!physicianInDB) {
				// new physician
				if (newPhysician._id) {
					delete newPhysician._id;
					// remove _id to avoid duplicate key in DB collection.
					// In case the email was changed for an existing physician
					// and a new physician creation is triggered.
				}
				const { response, statusCode } = await createPhysician(
					userContext.access_token,
					newPhysician,
				);
				creationError = statusCode !== 201;
				newPhysician._id = response._id; // undefined if not present
			} else {
				newPhysician._id = physicianInDB._id;
				if (!isPhysicianInfoEqual(physicianInDB, newPhysician)) {
					// update information in DB if needed
					const { statusCode } = await updatePhysician(
						userContext.access_token,
						newPhysician._id!,
						newPhysician,
					);
					updateError = statusCode !== 200;
				}
			}
		}
		if (creationError || updateError) {
			setOpenFailSnackbar(true);
		} else {
			setPhysician(newPhysician);
			setOpenSuccessSnackbar(true);
		}
	};

	return (
		<Paper sx={{ p: 2, width: '100%' }}>
			<Typography variant="h6" align="center">
				{header}
			</Typography>
			<FormWithValidation<PhysicianFormData>
				schema={schema}
				inputs={inputs}
				btnLabel={t('button.saveDataBtn')}
				errorMsg={t('formErrors.errorMsg')}
				onSubmit={handleSubmit}
				defaultValues={formatPhysicianDataToForm(physician())}
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
