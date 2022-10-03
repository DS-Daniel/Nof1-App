import useTranslation from 'next-translate/useTranslation';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { Posology, PosologyDay } from '../../../entities/posology';
import { useForm } from 'react-hook-form';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

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
}

/**
 * Table component for a posology.
 */
export default function PosologyTable({
	rows,
	repeatLast,
	onSave,
}: PosologyTableProps) {
	const [checked, setChecked] = useState(repeatLast);
	const { t } = useTranslation('common');
	const headers = [
		t('posology-table.day'),
		t('posology-table.morning'),
		t('posology-table.fraction'),
		t('posology-table.noon'),
		t('posology-table.fraction'),
		t('posology-table.evening'),
		t('posology-table.fraction'),
		t('posology-table.night'),
		t('posology-table.fraction'),
	];

	const { register, handleSubmit } = useForm<PosologyDay[]>({
		defaultValues: rows,
	});

	/**
	 * Handle form submit.
	 * @param data Form data.
	 */
	const onSubmit = (data: PosologyDay[]) => {
		onSave({ posology: data, repeatLast: checked });
	};

	/**
	 * Render an input TableCell component.
	 * @param name Name of the input.
	 * @param defaultValue Default value.
	 * @returns The TableCell component.
	 */
	const renderTableCell = (name: RegisterType, defaultValue: number) => {
		return (
			<TableCell align="center">
				<Input
					size="small"
					autoFocus
					id={name}
					type="number"
					inputProps={{
						min: 0,
						style: { textAlign: 'center' },
					}}
					defaultValue={defaultValue}
					{...register(name, {
						valueAsNumber: true,
						pattern: { value: /^[0-9]+$/, message: 'only numbers' },
					})}
				/>
			</TableCell>
		);
	};

	return (
		<>
			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
				<Toolbar>
					<Stack direction="row" spacing={2} alignItems="center">
						<Button type="submit" variant="outlined">
							{t('createTest:parameters.save-posology-btn')}
						</Button>
						<Typography variant="body2">
							{t('createTest:parameters.warning-save-posology')}
						</Typography>
					</Stack>
				</Toolbar>
				<TableContainer>
					<Table aria-labelledby="tableTitle" size="medium">
						<TableHead>
							<TableRow>
								{headers.map((header, index) => (
									<TableCell key={`posology-header-${index}`} align="center">
										<Typography>{header}</Typography>
									</TableCell>
								))}
							</TableRow>
						</TableHead>

						<TableBody>
							{rows.map((posology, index) => (
								// iterate over object properties does not guarantee right ordering
								<TableRow key={`table-row-${index}`}>
									<TableCell align="center">
										<Input
											size="small"
											id={`${index}.day`}
											inputProps={{ style: { textAlign: 'center' } }}
											value={posology.day}
										/>
									</TableCell>
									{renderTableCell(`${index}.morning`, posology.morning)}
									{renderTableCell(
										`${index}.morningFraction`,
										posology.morningFraction,
									)}
									{renderTableCell(`${index}.noon`, posology.noon)}
									{renderTableCell(
										`${index}.noonFraction`,
										posology.noonFraction,
									)}
									{renderTableCell(`${index}.evening`, posology.evening)}
									{renderTableCell(
										`${index}.eveningFraction`,
										posology.eveningFraction,
									)}
									{renderTableCell(`${index}.night`, posology.night)}
									{renderTableCell(
										`${index}.nightFraction`,
										posology.nightFraction,
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Stack direction="row" alignItems="center" spacing={2}>
				<Checkbox
					checked={checked}
					onChange={(e) => setChecked(e.target.checked)}
				/>
				<Typography>
					{t('createTest:parameters.posology-repeat-switch')}
				</Typography>
			</Stack>
		</>
	);
}
