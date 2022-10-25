import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ReactNode } from 'react';

type TooltipRightProps = {
	infoText: string;
	children: ReactNode;
};

export default function TooltipRight({ infoText, children }: TooltipRightProps) {
	return (
		<Stack direction="row" alignItems="center" spacing={1}>
			{children}
			<Tooltip
				title={
					<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
						{infoText}
					</Typography>
				}
				// placement="right"
				arrow
			>
				<InfoOutlinedIcon color="primary" fontSize="small" />
			</Tooltip>
		</Stack>
	);
}
