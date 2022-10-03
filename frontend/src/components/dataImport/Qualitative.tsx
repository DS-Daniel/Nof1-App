import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { ChangeEvent, useState } from 'react';
import VarLayout from './VarLayout';
import { VarProps } from './varCommon';

/**
 * Component that render input for a qualitative type variable.
 */
export default function Qualitative({
	variable,
	defaultValue,
	onChange,
}: VarProps) {
	const inputs = variable.values!.split(';');
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
			<FormControl>
				<RadioGroup row name="choice" value={value} onChange={handleChange}>
					{inputs.map((input) => (
						<FormControlLabel
							key={input}
							control={<Radio />}
							label={input}
							labelPlacement="bottom"
							value={input}
						/>
					))}
				</RadioGroup>
			</FormControl>
		</VarLayout>
	);
}
