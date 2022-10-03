import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface VarLayoutProps {
	children: ReactNode;
	name: string;
	desc: string;
}

/**
 * Component that render a variable input layout.
 */
export default function VarLayout({ children, name, desc }: VarLayoutProps) {
	return (
		<Stack direction="row" spacing={4}>
			<Typography fontWeight="bold" width={150}>
				{name}
			</Typography>
			<Stack spacing={1} width={'100%'}>
				<Typography>{desc}</Typography>
				{children}
			</Stack>
		</Stack>
	);
}
