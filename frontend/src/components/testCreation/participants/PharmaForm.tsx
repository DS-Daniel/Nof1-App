import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { useEmailSchema } from '../../../utils/zodValidationHook';
import FormWithValidation from '../../common/FormWithValidation';
import { MutableRefObject, useState } from 'react';
import SuccessSnackbar from '../../common/SuccessSnackbar';

type PharmaFormProps = {
	pharmaEmail: MutableRefObject<string>;
};

/**
 * Component that manages and renders the pharmacy form.
 */
export default function PharmaForm({ pharmaEmail }: PharmaFormProps) {
	const { t } = useTranslation('common');
	const schema = useEmailSchema();
	const [openSnackbar, setOpenSnackbar] = useState(false);

	// form inputs data.
	const inputs = [{ name: 'email', trad: t('form.email') }];

	return (
		<Paper sx={{ p: 2, width: '100%' }}>
			<Typography variant="h6">
				{t('createTest:participants.pharmaEmail')}
			</Typography>
			<FormWithValidation
				schema={schema}
				inputs={inputs}
				btnLabel={t('button.saveDataBtn')}
				errorMsg={t('formErrors.errorMsg')}
				onSubmit={(data: { email: string }) => {
					pharmaEmail.current = data.email;
					setOpenSnackbar(true);
				}}
				defaultValues={{ email: pharmaEmail.current }}
			/>
			<SuccessSnackbar
				open={openSnackbar}
				setOpen={setOpenSnackbar}
				msg={t('formErrors.successMsg')}
			/>
		</Paper>
	);
}
