import VarLayout from './VarLayout';
import useTranslation from 'next-translate/useTranslation';
import { VarProps } from './varCommon';
import { ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { numericInputRegex, numericInputPattern } from '../../utils/constants';

/**
 * Component that renders an input for a numeric type variable.
 */
export default function Numeric({
	variable,
	defaultValue,
	onChange,
}: VarProps) {
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

	const isInvalid = () => {
		return !(value === '' || numericInputRegex.test(value));
	};

	return (
		<VarLayout name={variable.name} desc={variable.desc}>
			<TextField
				id="numeric-input"
				label={t('response')}
				inputProps={{
					inputMode: 'numeric',
					pattern: numericInputPattern,
					title: t('common:formErrors.number'),
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">{variable.unit}</InputAdornment>
					),
				}}
				value={value}
				onChange={handleChange}
				error={isInvalid()}
				helperText={isInvalid() ? t('common:formErrors.number') : ''}
			/>
		</VarLayout>
	);
}
