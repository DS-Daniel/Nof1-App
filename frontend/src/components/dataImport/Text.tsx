import VarLayout from './VarLayout';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import { ChangeEvent, useState } from 'react';

/**
 * Component that render input for a text type variable.
 */
export default function Text({ variable, defaultValue, onChange }: VarProps) {
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
			<Typography>{t('response')}</Typography>
			<TextField
				id="multiline-input"
				size="small"
				fullWidth
				multiline
				rows={3}
				value={value}
				onChange={handleChange}
			/>
		</VarLayout>
	);
}
