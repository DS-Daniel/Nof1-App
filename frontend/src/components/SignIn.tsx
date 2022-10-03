import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { authenticate } from '../utils/apiCalls';
import useTranslation from 'next-translate/useTranslation';
import { UserContextType } from '../context/UserContext';
import { emailRegex } from '../utils/constants';

type SignInProps = {
	login: (u: UserContextType) => void;
};

/**
 * Sign In component. Expose a form to sign in a user.
 */
export default function SignIn({ login }: SignInProps) {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [invalidCredentials, setInvalidCredentials] = useState(false);
	const [inputError, setInputError] = useState(false);

	/**
	 * Helper method called by the API call that handles the response.
	 * @param noError Boolean value indicating errors during authentication.
	 * @param user User resulting from the authentication.
	 */
	const handleAuth = (noError: boolean, user: UserContextType) => {
		if (noError) {
			login(user);
			router.push('/nof1');
		} else {
			setInvalidCredentials(true);
		}
	};

	/**
	 * Handle submit of the form. It call the API to sign in the user.
	 * @param event HTML form event.
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const emailData = data.get('email');
		const validInput = emailRegex.test(emailData!.toString());
		if (validInput) {
			setInputError(false);
			const body = {
				email: emailData,
				password: data.get('password'),
			};
			authenticate('/auth/login', body, handleAuth);
		} else {
			setInputError(!validInput);
		}
	};

	/**
	 * Helper method to render an alert component in case of error.
	 * @returns An alert component.
	 */
	const showAlert = () => {
		if (invalidCredentials) {
			return (
				<Grid item xs={12}>
					<Alert severity="error">{t('formErrors.invalidCredentials')}</Alert>
				</Grid>
			);
		}
	};

	return (
		<Card>
			<CardContent>
				<Typography component="h1" variant="h5" align="center">
					{t('form.signIn')}
				</Typography>
				<Box component="form" onSubmit={handleSubmit} mt={1}>
					<Grid
						container
						rowSpacing={2}
						alignItems="center"
						justifyContent="center"
					>
						<Grid item xs={12}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="signIn-email"
								name="email"
								type="email"
								label={t('form.email')}
								autoComplete="email"
								error={inputError}
								helperText={inputError ? t('formErrors.emailInvalid') : ''}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="signIn-password"
								name="password"
								type="password"
								label={t('form.password')}
								autoComplete="current-password"
							/>
						</Grid>
						{showAlert()}
						<Grid item xs={5}>
							<Button
								type="submit"
								variant="contained"
								fullWidth
								sx={{ mt: 2 }}
							>
								{t('form.signIn')}
							</Button>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
}
