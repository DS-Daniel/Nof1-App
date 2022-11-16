import { FC } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface OptionBtnProps extends ButtonProps {
	width?: number;
	tooltipText?: string;
}

/**
 * Custom button for the options.
 * @param props Button props.
 * @returns A Button component.
 */
const OptionBtn: FC<OptionBtnProps> = ({
	children,
	variant = 'contained',
	tooltipText,
	width = 220,
	...props
}) => {
	return (
		<Button
			variant={variant}
			sx={{ width: width }}
			endIcon={
				tooltipText && (
					<Tooltip
						title={
							<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
								{tooltipText}
							</Typography>
						}
						arrow
					>
						<InfoOutlinedIcon fontSize="small" />
					</Tooltip>
				)
			}
			{...props}
		>
			{children}
		</Button>
	);
};
export default OptionBtn;
