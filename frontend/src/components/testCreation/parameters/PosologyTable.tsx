import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Posology, PosologyDay } from '../../../entities/posology';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {
	numericInputPattern,
	numericInputRegex,
} from '../../../utils/constants';
import PosologyHead from '../../common/posologyTable/PosologyHead';

// custom TableRow component
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	// '&:last-child td, &:last-child th': {
	//   border: 0,
	// },
}));

// custom TableCell component
const StyledTableCell = styled(TableCell, {
	shouldForwardProp: (prop) => prop !== 'borderR',
})<{
	borderR: boolean;
}>(({ borderR, theme }) => ({
	...(borderR && { borderRight: '1px solid' }),
	borderColor: theme.palette.divider,
}));

type RegisterType =
	| `${number}`
	| `${number}.day`
	| `${number}.morning`
	| `${number}.morningFraction`
	| `${number}.noon`
	| `${number}.noonFraction`
	| `${number}.evening`
	| `${number}.eveningFraction`
	| `${number}.night`
	| `${number}.nightFraction`;

interface PosologyTableProps {
	rows: PosologyDay[];
	repeatLast: boolean;
	onSave: (posology: Posology) => void;
	substanceUnit: string;
}

/**
 * Table component for a posology.
 */
export default function PosologyTable({
	rows,
	repeatLast,
	onSave,
	substanceUnit,
}: PosologyTableProps) {
	const [checked, setChecked] = useState(repeatLast);
	const { t } = useTranslation('createTest');

	const { register, handleSubmit } = useForm<PosologyDay[]>({
		defaultValues: rows,
	});

	/**
	 * Handles form submit.
	 * @param data Form data.
	 */
	const onSubmit = (data: PosologyDay[]) => {
		onSave({ posology: data, repeatLast: checked });
	};

	/**
	 * Renders an input TableCell component.
	 * @param name Name of the input.
	 * @param defaultValue Default value.
	 * @returns The TableCell component.
	 */
	const renderTableCell = (
		name: RegisterType,
		defaultValue: number,
		borderRight: boolean = false,
	) => {
		return (
			<StyledTableCell align="center" borderR={borderRight}>
				<Input
					size="small"
					autoFocus
					id={name}
					// type="number"
					disableUnderline
					inputProps={{
						min: 0,
						style: { textAlign: 'center' },
						inputMode: 'numeric',
						pattern: numericInputPattern,
						title: t('common:formErrors.number'),
					}}
					defaultValue={defaultValue}
					{...register(name, {
						valueAsNumber: true,
						pattern: {
							value: numericInputRegex,
							message: t('common:formErrors.number'),
						},
					})}
				/>
			</StyledTableCell>
		);
	};

	return (
		<>
			<Box component="form" id="" onSubmit={handleSubmit(onSubmit)}>
				<TableContainer sx={{ borderRadius: '8px 8px 0 0' }}>
					<Table size="small">
						<PosologyHead substanceUnit={substanceUnit} />
						<TableBody>
							{rows.map((posology, index) => (
								// iterate over object properties does not guarantee right ordering
								<StyledTableRow key={`table-row-${index}`}>
									<StyledTableCell align="center" borderR>
										<Input
											size="small"
											id={`${index}.day`}
											inputProps={{ style: { textAlign: 'center' } }}
											value={posology.day}
											disableUnderline
											readOnly
										/>
									</StyledTableCell>
									{renderTableCell(`${index}.morning`, posology.morning)}
									{renderTableCell(
										`${index}.morningFraction`,
										posology.morningFraction,
										true,
									)}
									{renderTableCell(`${index}.noon`, posology.noon)}
									{renderTableCell(
										`${index}.noonFraction`,
										posology.noonFraction,
										true,
									)}
									{renderTableCell(`${index}.evening`, posology.evening)}
									{renderTableCell(
										`${index}.eveningFraction`,
										posology.eveningFraction,
										true,
									)}
									{renderTableCell(`${index}.night`, posology.night)}
									{renderTableCell(
										`${index}.nightFraction`,
										posology.nightFraction,
									)}
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Stack direction="row" alignItems="center" spacing={2} mt={1}>
					<Checkbox
						checked={checked}
						onChange={(e) => setChecked(e.target.checked)}
					/>
					<Typography>{t('parameters.posology-repeat-switch')}</Typography>
				</Stack>
				<Stack direction="row" spacing={2} alignItems="center" mt={1} px={2}>
					<Button type="submit" variant="outlined">
						{t('parameters.save-posology-btn')}
					</Button>
					<Typography variant="body2">
						{t('parameters.warning-save-posology')}
					</Typography>
				</Stack>
			</Box>
		</>
	);
}
