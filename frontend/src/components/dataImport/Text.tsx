import VarLayout from './VarLayout';
import TextField from '@mui/material/TextField';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import { ChangeEvent, useState } from 'react';

/**
 * Component that renders an input for a text type variable.
 */
export default function Text({ variable, defaultValue, onChange }: VarProps) {
	const { t } = useTranslation('importData');
	const [value, setValue] = useState(defaultValue);

	/**
	 * Handles input value changes.
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
			<TextField
				id="multiline-input"
				label={t('response')}
				size="small"
				fullWidth
				multiline
				minRows={3}
				maxRows={5}
				value={value}
				onChange={handleChange}
			/>
		</VarLayout>
	);
}
