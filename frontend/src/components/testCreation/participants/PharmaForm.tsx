import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import {
	PharmacyFormData,
	usePharmacySchema,
} from '../../../utils/zodValidationHook';
import FormWithValidation from '../../common/FormWithValidation';
import { MutableRefObject, useState } from 'react';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import { Pharmacy } from '../../../entities/people';
import {
	formatPharmacyData,
	formatPharmacyDataToForm,
} from '../../../utils/dataFormConvertor';

type PharmaFormProps = {
	pharmacy: MutableRefObject<Pharmacy>;
};

/**
 * Component that manages and renders the pharmacy form.
 */
export default function PharmaForm({ pharmacy }: PharmaFormProps) {
	const { t } = useTranslation('common');
	const schema = usePharmacySchema();
	const [openSnackbar, setOpenSnackbar] = useState(false);

	// form inputs data.
	const inputs = [
		{ name: 'name', trad: t('form.lastname') },
		{ name: 'email', trad: t('form.email') },
		{ name: 'phone', trad: t('form.phone'), size: 6 },
		{ name: 'country', trad: t('form.country'), size: 6 },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 5 },
		{ name: 'city', trad: t('form.city'), size: 7 },
	];

	const handleSubmit = async (data: PharmacyFormData) => {
		pharmacy.current = formatPharmacyData(data);
		setOpenSnackbar(true);
	};

	return (
		<Paper sx={{ p: 2, width: '100%' }}>
			<Typography variant="h6">
				{t('createTest:participants.pharmacy')}
			</Typography>
			<FormWithValidation<PharmacyFormData>
				schema={schema}
				inputs={inputs}
				btnLabel={t('button.saveDataBtn')}
				errorMsg={t('formErrors.errorMsg')}
				onSubmit={handleSubmit}
				defaultValues={formatPharmacyDataToForm(pharmacy.current)}
			/>
			<SuccessSnackbar
				open={openSnackbar}
				setOpen={setOpenSnackbar}
				msg={t('formErrors.successMsg')}
			/>
		</Paper>
	);
}
