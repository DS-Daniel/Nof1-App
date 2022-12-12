import { Translate } from 'next-translate';
import { FormState, UseFormRegister } from 'react-hook-form';
import { Variable } from '../../../../entities/variable';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export type InputsProps = {
	register: UseFormRegister<Variable>;
	t: Translate;
	validation?: {
		validate: (name: string) => boolean;
		errors: FormState<Variable>['errors'];
	};
	periodLen?: number;
};

export const Name = ({ register, t, validation }: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('name', {
		required: t('common:formErrors.requiredField'),
		maxLength: {
			value: 64,
			message: t('common:formErrors.maxLen-n', { n: 64 }),
		},
		validate: (val) =>
			validation?.validate(val) || t('variables.error.already-exist'),
	});
	return (
		<TextField
			autoFocus
			id="name"
			label={t('variables.header.name')}
			type="text"
			fullWidth
			error={!!validation?.errors.name}
			helperText={validation?.errors.name?.message}
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Description = ({ register, t }: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('desc');
	return (
		<TextField
			autoFocus
			id="desc"
			label={t('variables.header.desc')}
			type="text"
			multiline
			maxRows={3}
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Unit = ({ register, t }: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('unit', {
		shouldUnregister: true,
	});
	return (
		<TextField
			autoFocus
			id="unit"
			label={t('variables.header.unit')}
			type="text"
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Min = ({ register, t }: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('min', {
		shouldUnregister: true,
	});
	return (
		<TextField
			autoFocus
			id="min"
			label={t('variables.header.min')}
			type="text"
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const Max = ({ register, t }: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('max', {
		shouldUnregister: true,
	});
	return (
		<TextField
			autoFocus
			id="max"
			label={t('variables.header.max')}
			type="text"
			fullWidth
			inputRef={inputRef}
			{...registerProps}
		/>
	);
};

export const SkippedRunInDays = ({
	register,
	t,
	validation,
	periodLen,
}: InputsProps) => {
	const { ref: inputRef, ...registerProps } = register('skippedRunInDays', {
		shouldUnregister: true,
		required: t('common:formErrors.requiredField'),
		min: { value: 0, message: t('variables.error.min0') },
		max: {
			value: periodLen!,
			message: t('variables.error.max'),
		},
		valueAsNumber: true,
	});
	return (
		<Stack direction="row" alignItems="center" spacing={2}>
			<TextField
				autoFocus
				id="skippedRunInDays"
				label={t('variables.header.skip')}
				type="number"
				fullWidth
				defaultValue={0}
				error={!!validation?.errors.skippedRunInDays}
				helperText={validation?.errors.skippedRunInDays?.message}
				inputRef={inputRef}
				{...registerProps}
			/>
			<Tooltip
				title={
					<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
						{t('variables.skipped-run-in-desc')}
					</Typography>
				}
				arrow
			>
				<InfoOutlinedIcon color="primary" />
			</Tooltip>
		</Stack>
	);
};
