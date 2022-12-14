import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';

type TooltipRightProps = {
	infoText: string;
	placement?: TooltipProps['placement'];
	color?: SvgIconProps['color'];
	children: ReactNode;
};

export default function CustomTooltip({
	infoText,
	placement = 'right',
	color = 'primary',
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
				<InfoOutlinedIcon color={color} fontSize="small" />
			</Tooltip>
		</Stack>
	);
}
