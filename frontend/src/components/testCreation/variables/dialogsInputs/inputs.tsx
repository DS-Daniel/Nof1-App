import TextField from '@mui/material/TextField';
import { Translate } from 'next-translate';
import { FormState, UseFormRegister } from 'react-hook-form';
import { Variable } from '../../../../entities/variable';

export interface InputsProps {
	register: UseFormRegister<Variable>;
	t: Translate;
	validation: {
		validate: (name: string) => boolean;
		errors: FormState<Variable>['errors'];
	};
}

interface InputProps extends Omit<InputsProps, 'validation'> {}

export const Name = ({ register, t, validation }: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('name', {
		required: t('common:formErrors.requiredField'),
		maxLength: {
			value: 64,
			message: t('common:formErrors.maxLen-n', { n: 64 }),
		},
		validate: (val) =>
			validation.validate(val) || t('variables.error-already-exist'),
	});
	return (
		<TextField
			autoFocus
			id="name"
			label={t('variables.header-name')}
			type="text"
			fullWidth
			error={!!validation.errors.name}
			helperText={validation.errors.name?.message}
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Description = ({ register, t }: InputProps) => {
	const { ref: inputRef, ...registerProps } = register('desc');
	return (
		<TextField
			autoFocus
			id="desc"
			label={t('variables.header-desc')}
			type="text"
			multiline
			maxRows={3}
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Unit = ({ register, t }: InputProps) => {
	const { ref: inputRef, ...registerProps } = register('unit', {
		shouldUnregister: true,
	});
	return (
		<TextField
			autoFocus
			id="unit"
			label={t('variables.header-unit')}
			type="text"
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Min = ({ register, t }: InputProps) => {
	const { ref: inputRef, ...registerProps } = register('min', {
		shouldUnregister: true,
	});
	return (
		<TextField
			autoFocus
			id="min"
			label={t('variables.header-min')}
			type="text"
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Max = ({ register, t }: InputProps) => {
	const { ref: inputRef, ...registerProps } = register('max', {
		shouldUnregister: true,
	});
	return (
		<TextField
			autoFocus
			id="max"
			label={t('variables.header-max')}
			type="text"
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};
