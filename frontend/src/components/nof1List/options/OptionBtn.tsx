import Button, { ButtonProps } from '@mui/material/Button';
import { FC } from 'react';

/**
 * Custom button for the options.
 * @param props Button props.
 * @returns A Button component.
 */
const OptionBtn: FC<ButtonProps> = (props) => {
	return (
		<Button sx={{ width: 180 }} {...props}>
			{props.children}
		</Button>
	);
}
export default OptionBtn;
