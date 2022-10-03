import useTranslation from 'next-translate/useTranslation';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { UseFormRegister } from 'react-hook-form';
import { Variable } from '../../../../entities/variable';

interface Props {
	register: UseFormRegister<Variable>;
}

/**
 * Component that render inputs for a qualitative type variable.
 */
export default function QualitativeFormInputs({ register }: Props) {
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
			<Grid item xs={4}></Grid>
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
			<Grid item xs={11}>
				{t('variables.quantitative-helper-txt')}
			</Grid>
			<Grid item xs={11}>
				<TextField
					autoFocus
					id="values"
					label={t('variables.header-values')}
					type="text"
					fullWidth
					{...register('values')}
				/>
			</Grid>
		</>
	);
}
