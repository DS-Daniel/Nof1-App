import useTranslation from 'next-translate/useTranslation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { UseFormRegister } from 'react-hook-form';
import { Variable } from '../../../../entities/variable';

interface Props {
	register: UseFormRegister<Variable>;
}

/**
 * Component that render inputs for a numeric type variable.
 */
export default function NumericFormInputs({ register }: Props) {
	const { t } = useTranslation('createTest');

	return (
		<>
			<Grid item xs={7}>
				<TextField
					autoFocus
					id="name"
					label={t('variables.header-name')}
					type="text"
					fullWidth
					{...register('name')}
				/>
			</Grid>
			<Grid item xs={4}>
				<TextField
					autoFocus
					id="unit"
					label={t('variables.header-unit')}
					type="text"
					fullWidth
					{...register('unit')}
				/>
			</Grid>
			<Grid item xs={11}>
				<TextField
					autoFocus
					id="desc"
					label={t('variables.header-desc')}
					type="text"
					// fullWidth
					multiline
					maxRows={3}
					fullWidth
					{...register('desc')}
				/>
			</Grid>
			<Grid item xs={5.5}>
				<TextField
					autoFocus
					id="min"
					label={t('variables.header-min')}
					type="text"
					fullWidth
					{...register('min')}
				/>
			</Grid>
			<Grid item xs={5.5}>
				<TextField
					autoFocus
					id="max"
					label={t('variables.header-max')}
					type="text"
					fullWidth
					{...register('max')}
				/>
			</Grid>
		</>
	);
}
