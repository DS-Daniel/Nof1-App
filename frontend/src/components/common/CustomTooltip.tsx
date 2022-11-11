import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ReactNode } from 'react';

type TooltipRightProps = {
	infoText: string;
	placement?: TooltipProps['placement'];
	children: ReactNode;
};

export default function CustomTooltip({
	infoText,
	placement = 'right',
	children,
}: TooltipRightProps) {
	return (
		<Stack direction="row" alignItems="center" spacing={1}>
			{children}
			<Tooltip
				title={
					<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
						{infoText}
					</Typography>
				}
				placement={placement}
				arrow
			>
				<InfoOutlinedIcon color="primary" fontSize="small" />
			</Tooltip>
		</Stack>
	);
}
