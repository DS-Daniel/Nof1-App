import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { PosologiesProps } from '.';
import PosologyTable from './PosologyTable';
import { initialPosology, Posology } from '../../../entities/posology';
import SuccessSnackbar from '../../common/SuccessSnackbar';
import FailSnackbar from '../../common/FailSnackbar';
import { maxValue } from '../../../utils/constants';

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
    const someEmptySubstance = substances.some(sub => sub.name === '')
    if (periodLen <= maxValue && !someEmptySubstance) {
			setDefaultPosologies();
		} else {
      setOpenFailSnackbar(true);
    }
  }

	return (
		<Stack alignItems="center">
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
				allPosologies.map(({ substance, unit, posologies }, subIdx) => (
					<Box key={`substance-posology-${subIdx}`}>
						<Typography fontWeight="bold">
							{t('parameters.substance-x', { substance })}
						</Typography>

						<Stack alignItems="center" spacing={2}>
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
								sx={{ mx: 'auto' }}
							>
								{t('parameters.add-posology-btn')}
							</Button>
						</Stack>
					</Box>
				))
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
		</Stack>
	);
}
