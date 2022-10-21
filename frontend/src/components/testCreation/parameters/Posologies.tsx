import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { PosologiesProps } from '.';
import { initialPosology, Posology } from '../../../entities/posology';
import PosologyTable from './PosologyTable';

/**
 * Posologies component. Renders the posologies form tables for each substance.
 */
export default function Posologies({
	substances,
	periodLen,
	allPosologies,
	setAllPosologies,
}: PosologiesProps) {
	const { t } = useTranslation('createTest');
	const [openSnackbar, setOpenSnackbar] = useState(false);

	/**
	 * Save the new posology.
	 * @param substance Substance concerned.
	 * @param posology New posology.
	 * @param position Position of the posology to save.
	 */
	const savePosology = (
		substance: string,
		posology: Posology,
		position: number,
	) => {
		setAllPosologies((prevData) => {
			const idx = prevData.findIndex((s) => s.substance === substance);
			if (idx !== -1) {
				const newData = [...prevData];
				if (prevData[idx].posologies[position] !== undefined) {
					// update a posology
					newData[idx].posologies[position] = posology;
				} else {
					// additional posology for a substance
					const existing = newData[idx].posologies;
					newData[idx].posologies = [...existing, posology];
				}
				return newData;
			} else {
				// new substance entry ?
				// return [...prevData, { substance, posologies: [posology] }];
				return prevData;
			}
		});
	};

	/**
	 * Add a new posology table form for a substance.
	 * @param substanceName Substance name.
	 */
	const addNewPosologyTable = (substanceName: string) => {
		setAllPosologies((prevData) => {
			const idx = prevData.findIndex((s) => s.substance === substanceName);
			if (idx !== -1) {
				const newData = [...prevData];
				const existing = newData[idx].posologies;
				newData[idx].posologies = [...existing, initialPosology(periodLen)];
				return newData;
			} else {
				return prevData;
			}
		});
	};

	/**
	 * Set the default posologies for all substances.
	 */
	const setDefaultPosologies = () => {
		const defaultPosologies = substances.map((substance) => ({
			substance: substance.name,
			unit: substance.unit,
			posologies: [initialPosology(periodLen)],
		}));
		setAllPosologies(defaultPosologies);
	};

	return (
		<Stack alignItems="center">
			{allPosologies.length === 0 ? (
				<Stack alignItems="center" spacing={1}>
					<Button variant="outlined" onClick={() => setDefaultPosologies()}>
						{t('parameters.config-posology-btn')}
					</Button>
					<Typography
						variant="body2"
						fontStyle="italic"
						textAlign="center"
						width="60%"
					>
						{t('parameters.warning-config-posology')}
					</Typography>
				</Stack>
			) : (
				allPosologies.map(({ substance, unit, posologies }, index) => (
					<Box key={`substance-posology-${index}`}>
						<Typography>
							{t('parameters.substance-x', { substance })}
						</Typography>

						<Stack alignItems="center" spacing={1}>
							{posologies.map(({ posology, repeatLast }, idx) => (
								<Stack key={`substance-posology-data-${idx}`} spacing={1}>
									<Typography>
										{t('parameters.posology-x', { x: idx + 1 })}
									</Typography>
									<PosologyTable
										rows={posology}
										repeatLast={repeatLast}
										onSave={(newPosology) => {
											savePosology(substance, newPosology, idx);
											setOpenSnackbar(true);
										}}
										substanceUnit={unit}
									/>
								</Stack>
							))}
							<Button
								variant="contained"
								onClick={() => addNewPosologyTable(substance)}
								sx={{ mx: 'auto' }}
							>
								{t('parameters.add-posology-btn')}
							</Button>
						</Stack>
					</Box>
				))
			)}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert
					variant="filled"
					severity="success"
					onClose={() => setOpenSnackbar(false)}
				>
					{t('common:formErrors.successMsg')}
				</Alert>
			</Snackbar>
		</Stack>
	);
}
