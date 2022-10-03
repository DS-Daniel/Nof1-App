import VarLayout from './VarLayout';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import { ChangeEvent, useState } from 'react';

/**
 * Component that render input for a numeric type variable.
 */
export default function Numeric({
	variable,
	defaultValue,
	onChange,
}: VarProps) {
	const { t } = useTranslation('importData');
	const [value, setValue] = useState(defaultValue);

	/**
	 * Handle input value changes.
	 * @param e HTML event.
	 */
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setValue(e.target.value);
		onChange(e.target.value);
	};

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<Stack direction="row" spacing={2}>
				<Typography>{t('response')}</Typography>
				<TextField
					id="multiline-input"
					variant="standard"
					value={value}
					onChange={handleChange}
				/>
				<Typography>{variable.unit}</Typography>
			</Stack>
		</VarLayout>
	);
}
