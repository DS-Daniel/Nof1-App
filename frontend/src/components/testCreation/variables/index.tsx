import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { Variable } from '../../../entities/variable';
import VarTable from './VarTable';
import AddIcon from '@mui/icons-material/Add';
import VarDialog from './VarDialog';
import Stack from '@mui/material/Stack';
import { usePredefinedHealthVariables } from '../../../utils/customHooks';

interface VariablesProps {
	variables: Variable[];
	setVariables: Dispatch<SetStateAction<Variable[]>>;
}

/**
 * Monitored health variables section component. Manages and displays variables in a table.
 */
export default function Variables({ variables, setVariables }: VariablesProps) {
	const { t } = useTranslation('createTest');

	const predefinedHealthVariables = usePredefinedHealthVariables();
	// determine the default checkboxes states.
	const defaultCheckboxes = () => {
		const state: { [key: string]: boolean } = {};
		predefinedHealthVariables.forEach((v) => (state[v.name] = false));
		return state;
	};
	const [checkboxesState, setCheckboxesState] = useState(defaultCheckboxes());
	const [openDialog, setOpenDialog] = useState(false);

	// update checkboxes state if data are loaded from an existing N-of-1 test
	useEffect(() => {
		const state = { ...checkboxesState };
		predefinedHealthVariables.forEach((predefinedVar) => {
			const v = variables.find((v) => v.name === predefinedVar.name);
			if (v) {
				state[v.name] = true;
			}
		});
		setCheckboxesState(state);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Add a new variable.
	 * @param v Variable.
	 */
	const addVariable = (v: Variable) => {
		setVariables([...variables, v]);
	};

	/**
	 * Remove a variable.
	 * @param idx Index of the variable to remove.
	 */
	const removeVariable = (idx: number) => {
		const array = [...variables];
		const varRemoved = array.splice(idx, 1);
		setVariables(array);
		// update checkboxes state if needed
		const checkboxToUncheck = predefinedHealthVariables.find(
			(v) => v.name === varRemoved[0].name,
		);
		if (checkboxToUncheck) {
			setCheckboxesState({
				...checkboxesState,
				[checkboxToUncheck.name]: false,
			});
		}
	};

	/**
	 * Handle the submit action of the dialog that add a new variable.
	 * @param variable Variable.
	 */
	const handleDialogSubmit = (variable: Variable) => {
		addVariable(variable);
		setOpenDialog(false);
	};

	/**
	 * Handle the action to trigger when un/checking a checkboxes (add/remove).
	 * @param event HTML event.
	 */
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		setCheckboxesState({
			...checkboxesState,
			[name]: checked,
		});
		if (checked) {
			const v = predefinedHealthVariables.find((v) => v.name === name);
			if (v) addVariable(v);
		} else {
			const idx = variables.findIndex((v) => v.name === name);
			if (idx !== -1) removeVariable(idx);
		}
	};

	return (
		<Paper sx={{ p: 3, width: '100%' }}>
			<Stack spacing={3}>
				<Typography variant="h5">{t('variables.title')}</Typography>

				<VarTable rows={variables} removeRow={removeVariable} />

				<Stack alignItems="center">
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => setOpenDialog(true)}
					>
						{t('common:button.add')}
					</Button>
				</Stack>

				<VarDialog
					open={openDialog}
					handleDialogSubmit={(data) => handleDialogSubmit(data)}
					handleClose={() => setOpenDialog(false)}
				/>

				<Typography variant="h6" mb={2}>
					{t('variables.additional-var-subtitle')}
				</Typography>

				<FormGroup>
					<Grid
						container
						rowSpacing={2}
						alignItems="center"
						justifyContent="center"
					>
						{predefinedHealthVariables.map((v, idx) => {
							return (
								<Grid key={idx} item xs={12} sm={4}>
									<FormControlLabel
										control={
											<Checkbox
												checked={checkboxesState[v.name]}
												onChange={handleCheckboxChange}
												name={v.name}
											/>
										}
										label={v.name}
									/>
								</Grid>
							);
						})}
					</Grid>
				</FormGroup>
			</Stack>
		</Paper>
	);
}
