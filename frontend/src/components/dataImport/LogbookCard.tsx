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
 * Component that render the card layout of the variable inputs for a day.
 */
export default function LogbookCard({
	children,
	startDate,
	idx,
	periodLen,
}: LogbookCardProps) {
	const { t } = useTranslation('common');

	return (
		<Paper variant="outlined" sx={{ padding: 3, minWidth: 750 }}>
			<Stack direction="row" justifyContent="space-between">
				<Typography>
					{t('date')} :{' '}
					{dayjs(startDate).add(idx, 'day').toDate().toLocaleDateString()}
				</Typography>
				<Typography>
					{t('day')} {idx + 1} | {t('importData:period')}{' '}
					{Math.floor(idx / periodLen) + 1}
				</Typography>
			</Stack>
			<Stack mx={3} my={2} spacing={3}>
				{children}
			</Stack>
		</Paper>
	);
}
