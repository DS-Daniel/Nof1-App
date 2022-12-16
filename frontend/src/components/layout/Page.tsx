import Container from '@mui/material/Container';
import { ReactNode } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

type PageProps = {
	children: ReactNode;
};

/**
 * Page layout.
 */
export default function Page({ children }: PageProps) {
	return (
		<>
			<NavBar />
			<Container
				component="main"
				maxWidth="lg"
				sx={{
					my: 4,
				}}
			>
				{children}
			</Container>
			<Footer />
		</>
	);
}
