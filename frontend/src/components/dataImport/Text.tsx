import VarLayout from './VarLayout';
import TextField from '@mui/material/TextField';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { textareaRegex } from '../../utils/constants';

/**
 * Component that renders an input for a text type variable.
 */
export default function Text({ variable, defaultValue, onChange }: VarProps) {
	const { t } = useTranslation('importData');
	const [value, setValue] = useState(defaultValue);
	const textAreaRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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

	/**
	 * Checks if the input is valid.
	 */
	const isValid = () => {
		return value === '' || textareaRegex.test(value);
	};

	/**
	 * Set a custom validation on the textarea element,
	 * which will be detected by the form.
	 */
	useEffect(() => {
		textAreaRef.current?.setCustomValidity(
			isValid() ? '' : t('common:formErrors.textarea'),
		);
		textAreaRef.current?.reportValidity();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<TextField
				id="multiline-input"
				inputRef={textAreaRef}
				label={t('response')}
				fullWidth
				multiline
				minRows={3}
				maxRows={5}
				inputProps={{ maxLength: 500 }}
				value={value}
				onChange={handleChange}
				error={!isValid()}
				helperText={isValid() ? '' : t('common:formErrors.textarea')}
			/>
		</VarLayout>
	);
}
