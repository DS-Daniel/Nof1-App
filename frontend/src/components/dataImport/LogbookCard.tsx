import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import { ReactNode } from 'react';

interface LogbookCardProps {
	children: ReactNode;
	startDate: Date | string;
	idx: number;
	periodLen: number;
}

/**
 * Component that renders the card layout of the variable inputs for a day.
 */
export default function LogbookCard({
	children,
	startDate,
	idx,
	periodLen,
}: LogbookCardProps) {
	const { t } = useTranslation('common');

	return (
		<Paper variant="outlined" sx={{ padding: 3, maxWidth: 800 }}>
			{/* header */}
			<Stack direction="row" justifyContent="space-between" mb={2}>
				<Typography>
					{t('date')} :{' '}
					{dayjs(startDate).add(idx, 'day').toDate().toLocaleDateString()}
				</Typography>
				<Typography>
					{t('day')} {idx + 1} | {t('importData:period')}{' '}
					{Math.floor(idx / periodLen) + 1}
				</Typography>
			</Stack>
			{/* content */}
			<Grid container spacing={1} px={1}>
				{children}
			</Grid>
		</Paper>
	);
}
