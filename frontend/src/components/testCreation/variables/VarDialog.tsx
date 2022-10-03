import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import useTranslation from 'next-translate/useTranslation';
import { Variable, VariableType } from '../../../entities/variable';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import TextFormInputs from './dialogsInputs/TextFormInputs';
import BinaryFormInputs from './dialogsInputs/BinaryFormInputs';
import VASFormInputs from './dialogsInputs/VASFormInputs';
import NumericFormInputs from './dialogsInputs/NumericFormInputs';
import QualitativeFormInputs from './dialogsInputs/QualitativeFormInputs';

interface VarDialogProps {
	open: boolean;
	handleClose: () => void;
	handleDialogSubmit: (variable: Variable) => void;
}

/**
 * Dialog component to add a new monitored health variable.
 */
export default function VarDialog({
	open,
	handleClose,
	handleDialogSubmit,
}: VarDialogProps) {
	const { t } = useTranslation('createTest');

	const { register, handleSubmit, reset, watch } = useForm<Variable>({
		defaultValues: { type: VariableType.Text },
	});

	/**
	 * Handle submit of the dialog form.
	 * @param data Form data.
	 */
	const onSubmit = (data: Variable) => {
		handleDialogSubmit(data);
		reset();
	};

	/**
	 * Return the appropriate inputs according to the variable type.
	 */
	const getInputs = () => {
		switch (watch('type')) {
			case VariableType.Text:
				return <TextFormInputs register={register} />;
			case VariableType.Binary:
				return <BinaryFormInputs register={register} />;
			case VariableType.VAS:
				return <VASFormInputs register={register} />;
			case VariableType.Numeric:
				return <NumericFormInputs register={register} />;
			case VariableType.Qualitative:
				return <QualitativeFormInputs register={register} />;
		}
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>{t('variables.modal-title')}</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					id="var-form"
					onSubmit={handleSubmit(onSubmit)}
					mt={1}
				>
					<Grid
						container
						justifyContent="center"
						rowSpacing={2}
						columnSpacing={4}
					>
						<Grid item xs={11}>
							<TextField
								autoFocus
								id="type"
								label={t('variables.header-type')}
								select
								defaultValue={VariableType.Text}
								{...register('type')}
							>
								{Object.values(VariableType).map((t) => (
									<MenuItem key={`select-${t}`} value={t}>
										{t}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{getInputs()}
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{t('common:button.cancel')}</Button>
				<Button type="submit" form="var-form">
					{t('common:button.add')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
