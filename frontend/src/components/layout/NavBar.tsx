import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { AnchorHTMLAttributes, forwardRef } from 'react';
import { useUserContext } from '../../context/UserContext';
import ChangeLanguage from '../common/ChangeLanguage';

/**
 * Common navigation bar component.
 */
export default function NavBar() {
	const { t } = useTranslation('common');
	const { userContext, logout } = useUserContext();

	/**
	 * Custom logout link.
	 */
	// eslint-disable-next-line react/display-name
	const LogoutBtn = forwardRef<
		HTMLAnchorElement,
		AnchorHTMLAttributes<HTMLAnchorElement>
	>(({ href, onClick }, ref) => {
		return (
			<a
				href={href}
				onClick={onClick}
				ref={ref}
				style={{ textDecoration: 'none', color: 'inherit' }}
			>
				{t('nav.logout')}
			</a>
		);
	});

	return (
		<AppBar position="static">
			<Container component="div" maxWidth="xl">
				<Toolbar component="nav">
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						{t('nav.title')}
					</Typography>
					{userContext?.user && (
						<Stack direction="row" spacing={3}>
							<Link href="/nof1">
								<Typography sx={{ textDecoration: 'none', cursor: 'pointer' }}>
									{t('nav.nof1List')}
								</Typography>
							</Link>
							<Link href="/profile">
								<Typography sx={{ textDecoration: 'none', cursor: 'pointer' }}>
									{t('nav.profile')}
								</Typography>
							</Link>
							<Link href="/" passHref>
								<LogoutBtn onClick={logout} />
							</Link>
						</Stack>
					)}
					<ChangeLanguage />
				</Toolbar>
			</Container>
		</AppBar>
	);
}
