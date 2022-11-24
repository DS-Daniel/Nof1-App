import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { PosologiesProps } from '.';
import PosologyTable from './PosologyTable';
import PosologyTableWithState from './PosologyTableWithState';
import {
	initialPosology,
	Posology,
	PosologyDay,
} from '../../../entities/posology';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';
import { maxValue } from '../../../utils/constants';

/**
 * Posologies component. Renders the posologies form tables for each substance.
 */
export default function Posologies({
	substances,
	setSubstances,
	periodLen,
	allPosologies,
	setAllPosologies,
}: PosologiesProps) {
	const { t } = useTranslation('createTest');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [openFailSnackbar, setOpenFailSnackbar] = useState(false);

	/**
	 * Saves the edited posology.
	 * @param substanceIndex Substance index.
	 * @param posology New posology.
	 * @param position Position of the posology to update.
	 */
	const savePosology = (
		substanceIndex: number,
		posology: Posology,
		position: number,
	) => {
		setAllPosologies((prevData) => {
			const newData = [...prevData];
			newData[substanceIndex].posologies[position] = posology;
			return newData;
		});
	};

	// If we set up posologies as React state.
	// const updatePosologies = (
	// 	substanceIndex: number,
	// 	posologyIndex: number,
	// 	posologyDayIndex: number,
	// 	property: string,
	// 	value: number,
	// ) => {
	// 	setAllPosologies((prevData) => {
	// 		const newData = [...prevData];
	// 		newData[substanceIndex].posologies[posologyIndex].posology[
	// 			posologyDayIndex
	// 		][property as keyof PosologyDay] = value;
	// 		return newData;
	// 		// TODO update repeatLast too
	// 	});
	// };
	// console.log('poso', allPosologies);

	/**
	 * Adds a new posology table form for a substance.
	 * @param substanceIndex Substance index.
	 */
	const addNewPosologyTable = (substanceIndex: number) => {
		setAllPosologies((prevData) => {
			const newData = [...prevData];
			const existing = prevData[substanceIndex].posologies;
			newData[substanceIndex].posologies = [
				...existing,
				initialPosology(periodLen),
			];
			return newData;
		});
	};

	/**
	 * Removes a new posology table form for a substance.
	 * @param substanceIndex Substance index.
	 */
	const removePosologyTable = (
		substanceIndex: number,
		posologyIndex: number,
	) => {
		console.log('idx', posologyIndex);
		setAllPosologies((prevData) => {
			const newData = [...prevData];
			newData[substanceIndex].posologies.splice(posologyIndex, 1);
			console.log('removed poso', newData);
			return newData;
		});
	};

	/**
	 * Sets the default posologies for all substances.
	 */
	const setDefaultPosologies = () => {
		const defaultPosologies = substances.map((substance) => ({
			substance: substance.name,
			unit: substance.unit,
			posologies: [initialPosology(periodLen)],
		}));
		setAllPosologies(defaultPosologies);
	};

	/**
	 * Triggers the creation of the default posologies if parameters are valid.
	 */
	const handlePosologiesSetUp = () => {
		const someEmptySubstance = substances.some((sub) => sub.name === '');
		if (periodLen <= maxValue && !someEmptySubstance) {
			setDefaultPosologies();
		} else {
			setOpenFailSnackbar(true);
		}
	};

	/**
	 * Adds a posology table (with default values) to enter a
	 * decreasing dosage for a substance.
	 * @param subIdx Substance index.
	 */
	const addDecreasingDosage = (subIdx: number) => {
		setSubstances((prevSubstances) => {
			const substances = [...prevSubstances];
			const sub = substances[subIdx];
			sub.decreasingDosage = initialPosology(periodLen).posology;
			return substances;
		});
	};

	/**
	 * Updates a decreasing posology table.
	 * @param subIdx Substance index.
	 * @param posologyDayIndex Index of the day of the posology table to update.
	 * @param property Property of the posology table to update.
	 * @param value New value.
	 */
	const updateDecreasingDosage = (
		subIdx: number,
		posologyDayIndex: number,
		property: string,
		value: number,
	) => {
		setSubstances((prevSubstances) => {
			const substances = [...prevSubstances];
			substances[subIdx].decreasingDosage![posologyDayIndex][
				property as keyof PosologyDay
			] = value;
			return substances;
		});
	};

	/**
	 * Removes a decreasing posology table for a substance.
	 * @param subIdx Substance index.
	 */
	const removeDecreasingDosage = (subIdx: number) => {
		setSubstances((prevSubstances) => {
			const substances = [...prevSubstances];
			substances[subIdx].decreasingDosage = undefined;
			return substances;
		});
	};

	/**
	 * Renders a decreasing posology table for a substance or
	 * a button to add one, if none.
	 * @param subIdx Substance index.
	 * @returns A posology table or a button component.
	 */
	const renderDecreasingDosage = (subIdx: number) => {
		const sub = substances[subIdx];
		// posologies indexes are the same as substances indexes
		const table = sub.decreasingDosage;
		return table ? (
			<>
				<Stack direction="row" alignItems="center" spacing={2}>
					<Typography>{t('parameters.decreasing-posology.title')} :</Typography>
					<Button
						size="small"
						color="error"
						onClick={() => removeDecreasingDosage(subIdx)}
						startIcon={<ClearIcon />}
					>
						{t('common:button.delete')}
					</Button>
				</Stack>
				<PosologyTableWithState
					rows={table}
					onChange={(posologyRow, property, value) =>
						updateDecreasingDosage(subIdx, posologyRow, property, value)
					}
					substanceUnit={sub.unit}
				/>
			</>
		) : (
			<Button onClick={() => addDecreasingDosage(subIdx)}>
				{t('parameters.decreasing-posology.btn')}
			</Button>
		);
	};

	return (
		<>
			{/* ----- display a button to setup posologies if not done yet ----- */}
			{allPosologies.length === 0 ? (
				<Stack alignItems="center" spacing={1}>
					<Button variant="outlined" onClick={handlePosologiesSetUp}>
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
				<Stack spacing={6}>
					{/* ----- stack for each substance ----- */}
					{allPosologies.map(({ substance, unit, posologies }, subIdx) => (
						<Stack key={`substance-posology-${subIdx}`}>
							<Typography fontWeight="bold">
								{t('parameters.substance-x', { substance })}
							</Typography>

							{/* ----- all posologies of a substance ----- */}
							<Stack alignItems="center" spacing={2} mt={1} mb={4}>
								{posologies.map(({ posology, repeatLast }, posoIdx) => (
									<Stack key={`substance-posology-data-${posoIdx}`} spacing={1}>
										<Stack direction="row" alignItems="center" spacing={2}>
											<Typography>
												{t('parameters.posology-x', { x: posoIdx + 1 })}
											</Typography>
											{posoIdx > 0 && (
												<Button
													size="small"
													color="error"
													onClick={() => removePosologyTable(subIdx, posoIdx)}
													startIcon={<ClearIcon />}
												>
													{t('common:button.delete')}
												</Button>
											)}
										</Stack>
										<PosologyTable
											rows={posology}
											repeatLast={repeatLast}
											onSave={(newPosology) => {
												savePosology(subIdx, newPosology, posoIdx);
												setOpenSnackbar(true);
											}}
											// onChange={(posologyRow, property, value) =>
											// 	updatePosologies(
											// 		subIdx,
											// 		posoIdx,
											// 		posologyRow,
											// 		property,
											// 		value,
											// 	)
											// }
											substanceUnit={unit}
										/>
									</Stack>
								))}
								<Button
									variant="outlined"
									onClick={() => addNewPosologyTable(subIdx)}
								>
									{t('parameters.add-posology-btn')}
								</Button>
							</Stack>

							{/* ----- decreasing posology option for a substance ----- */}
							<Stack alignItems="start" spacing={1}>
								<Typography sx={{ whiteSpace: 'pre-line' }}>
									{t('parameters.decreasing-posology.desc')}
								</Typography>
								{renderDecreasingDosage(subIdx)}
							</Stack>
						</Stack>
					))}
				</Stack>
			)}
			<SuccessSnackbar
				open={openSnackbar}
				setOpen={setOpenSnackbar}
				msg={t('common:formErrors.successMsg')}
			/>
			<FailSnackbar
				open={openFailSnackbar}
				setOpen={setOpenFailSnackbar}
				msg={t('common:formErrors.errorMsg')}
			/>
		</>
	);
}
