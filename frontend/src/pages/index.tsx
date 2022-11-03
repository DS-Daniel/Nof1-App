import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useUserContext } from '../context/UserContext';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Page from '../components/layout/Page';

/**
 * Default application page. It requires the user to login or
 * to create an account to proceed further.
 */
export default function Auth() {
	const { t } = useTranslation('common');
	const { login } = useUserContext();
	const router = useRouter();

	// optimize loading of the next page.
  useEffect(() => {
		router.prefetch('/nof1');
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Page>
			<Grid
				container
				rowSpacing={6}
				columnGap={12}
				alignItems="center"
				justifyContent="center"
			>
				<Grid item xs={12}>
					<Typography
						variant="h5"
						align="center"
						sx={{ whiteSpace: 'pre-line' }}
					>
						{t('auth:welcome')}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={8} md={5}>
					<SignIn login={login} />
				</Grid>
				<Grid item xs={12} sm={8} md={5}>
					<SignUp login={login} />
				</Grid>
			</Grid>
		</Page>
	);
}
