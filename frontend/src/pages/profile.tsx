import AuthenticatedPage from '../components/layout/AuthenticatedPage';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormWithValidation, { FormInput } from '../components/common/forms/FormWithValidation';
import { useUserContext } from '../context/UserContext';
import {
	usePhysicianSchema,
	PhysicianFormData,
} from '../utils/zodValidationHook';
import useTranslation from 'next-translate/useTranslation';
import {
	formatPhysicianData,
	formatPhysicianDataToForm,
} from '../utils/dataFormConvertor';
import { SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { updatePhysician, updateUser, userExists } from '../utils/apiCalls';
import Skeleton from '@mui/material/Skeleton';
import SuccessSnackbar from '../components/common/SuccessSnackbar';
import FailSnackbar from '../components/common/FailSnackbar';

/**
 * Profile page.
 */
export default function Profile() {
	const { t } = useTranslation('common');
	const { userContext, setUserContext } = useUserContext();
	const schema = usePhysicianSchema();
	const [loading, setLoading] = useState(true);
	const [defaultValues, setDefaultValues] = useState<
		PhysicianFormData | undefined
	>(userContext.user ? formatPhysicianDataToForm(userContext.user) : undefined);
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);
	const [error, setError] = useState(false);

	// fetch user data if needed.
	useEffect(() => {
		if (defaultValues !== undefined) {
			setLoading(false);
		} else if (userContext.user) {
			setDefaultValues(formatPhysicianDataToForm(userContext.user));
			setLoading(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userContext]);

	/**
	 * Handle the click on the submit button.
	 * It checks if the data has changed and need to be updated.
	 * @param data User data from the form.
	 */
	const handleSubmit: SubmitHandler<PhysicianFormData> = async (data) => {
		const userExist = await userExists(userContext.access_token, data.email);
		const sameEmail = data.email === userContext.user?.email;
		if (sameEmail || userExist === null) {
			const physicianUpdate = formatPhysicianData(data);
			const { statusCode } = await updatePhysician(
				userContext.access_token,
				physicianUpdate._id!,
				physicianUpdate,
			);
			let userUpdateSuccess = true;
			if (!sameEmail && statusCode === 200) {
				// update user account email if necessary
				const { statusCode } = await updateUser(userContext.access_token, {
					email: userContext.user!.email,
					newEmail: physicianUpdate.email,
				});
				if (statusCode !== 200) userUpdateSuccess = false;
			}
			if (statusCode === 200 && userUpdateSuccess) {
				const newUserCtx = { ...userContext };
				newUserCtx.user = physicianUpdate;
				setError(false);
				setOpenSuccessSnackbar(true);
				setUserContext(newUserCtx);
			} else {
				setOpenFailSnackbar(true);
			}
		} else {
			setError(true);
		}
	};

	// form inputs data.
	const inputs: FormInput[] = [
		{ name: 'institution', trad: t('form.institution'), required: true },
		{ name: 'firstname', trad: t('form.firstname'), required: true, size: 6 },
		{ name: 'lastname', trad: t('form.lastname'), required: true, size: 6 },
		{ name: 'phone', trad: t('form.phone'), required: true },
		{ name: 'email', trad: t('form.email'), required: true },
		{ name: 'street', trad: t('form.street') },
		{ name: 'zip', trad: t('form.zip'), size: 4 },
		{ name: 'city', trad: t('form.city'), size: 8 },
		{ name: 'country', trad: t('form.country') },
	];

	return (
		<AuthenticatedPage>
			<Stack justifyContent="center" alignItems="center" spacing={3}>
				<Typography variant="h5">{t('profile:title')}</Typography>
				<Typography variant="h6">{t('profile:welcome')}</Typography>
				{loading ? (
					<Skeleton
						variant="rectangular"
						animation="wave"
						width={691}
						height={372}
					/>
				) : (
					<Paper sx={{ p: 2, width: '60%' }}>
						{error && (
							<Alert severity="error">
								{t('formErrors.userAlreadyExists2')}
							</Alert>
						)}
						<FormWithValidation<PhysicianFormData>
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
				)}
			</Stack>
		</AuthenticatedPage>
	);
}
