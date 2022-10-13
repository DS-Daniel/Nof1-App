import VarLayout from './VarLayout';
import TextField from '@mui/material/TextField';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { textInputPattern, textRegex } from '../../utils/constants';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

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

	const isValid = () => {
		return value === '' || textRegex.test(value);
	};

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
			{/* <FormControl fullWidth error={!isValid()}>
				<InputLabel htmlFor="multiline-input">{t('response')}</InputLabel>
				<OutlinedInput
					inputRef={textAreaRef}
					id="multiline-input"
					label={t('response')}
					multiline
					minRows={3}
					maxRows={5}
					value={value}
					onChange={handleChange}
					aria-describedby="multiline-input-error-text"
					inputProps={{ maxLength: 500 }}
				/>
				<FormHelperText id="multiline-input-error-text">
					{isValid() ? '' : t('common:formErrors.textarea')}
				</FormHelperText>
			</FormControl> */}
		</VarLayout>
	);
}
