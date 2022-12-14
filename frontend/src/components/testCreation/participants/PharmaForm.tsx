import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import {
	PharmacyFormData,
	usePharmacySchema,
} from '../../../utils/zodValidationHook';
import FormWithValidation, { FormInput } from '../../common/forms/FormWithValidation';
import { MutableRefObject, useState } from 'react';
import SuccessSnackbar from '../../common/ui/SuccessSnackbar';
import {
	formatPharmacyData,
	formatPharmacyDataToForm,
} from '../../../utils/dataFormConvertor';
import { IParticipants } from '../../../entities/nof1Test';

type PharmaFormProps = {
	participants: MutableRefObject<IParticipants>;
};

/**
 * Component that manages and renders the pharmacy form.
 */
export default function PharmaForm({ participants }: PharmaFormProps) {
	const { t } = useTranslation('common');
	const schema = usePharmacySchema();
	const [openSnackbar, setOpenSnackbar] = useState(false);

	// form inputs data.
	const inputs: FormInput[] = [
		{ name: 'name', trad: t('form.lastname') },
		{ name: 'email', trad: t('form.email'), required: true },
		{ name: 'phone', trad: t('form.phone'), size: 6 },
		{ name: 'country', trad: t('form.country'), size: 6 },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 5 },
		{ name: 'city', trad: t('form.city'), size: 7 },
	];

	const handleSubmit = async (data: PharmacyFormData) => {
		participants.current.pharmacy = formatPharmacyData(data);
		setOpenSnackbar(true);
	};

	return (
		<Paper sx={{ p: 2, width: '100%' }}>
			<Typography variant="h6" align="center">
				{t('createTest:participants.pharmacy')}
			</Typography>
			<FormWithValidation<PharmacyFormData>
				schema={schema}
				inputs={inputs}
				btnLabel={t('button.saveDataBtn')}
				errorMsg={t('formErrors.errorMsg')}
				onSubmit={handleSubmit}
				defaultValues={formatPharmacyDataToForm(participants.current.pharmacy)}
			/>
			<SuccessSnackbar
				open={openSnackbar}
				setOpen={setOpenSnackbar}
				msg={t('formErrors.successMsg')}
			/>
		</Paper>
	);
}
