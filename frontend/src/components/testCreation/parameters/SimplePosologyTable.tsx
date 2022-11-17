import useTranslation from 'next-translate/useTranslation';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { PosologyDay } from '../../../entities/posology';
import Input from '@mui/material/Input';
import { numericInputPattern } from '../../../utils/constants';
import PosologyHead from '../../common/table/posologyTable/PosologyHead';
import {
	StyledTableCell,
	StyledTableContainer,
	StyledTableRow,
} from '../../common/table/customTableComponents';

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

interface SimplePosologyTableProps {
	rows: PosologyDay[];
	onChange: (posologyRow: number, property: string, value: number) => void;
	substanceUnit: string;
}

/**
 * Controlled posology form component, without the checkbox for repetition.
 */
export default function SimplePosologyTable({
	rows,
	onChange,
	substanceUnit,
}: SimplePosologyTableProps) {
	const { t } = useTranslation('createTest');

	/**
	 * Renders an input TableCell component.
	 * @param name Name of the input.
	 * @param defaultValue Default value.
	 * @param borderRight Display a right border.
	 * @returns The TableCell component.
	 */
	const renderTableCell = (
		name: RegisterType,
		defaultValue: number,
		borderRight: boolean = false,
	) => {
		const [row, property] = name.split('.');
		return (
			<StyledTableCell align="center" borderR={borderRight}>
				<Input
					size="small"
					autoFocus
					id={name}
					disableUnderline
					inputProps={{
						min: 0,
						style: { textAlign: 'center' },
						inputMode: 'numeric',
						pattern: numericInputPattern,
						title: t('common:formErrors.number'),
					}}
					value={defaultValue}
					onChange={(e) =>
						onChange(Number(row), property, Number(e.target.value))
					}
				/>
			</StyledTableCell>
		);
	};

	return (
		<>
			<StyledTableContainer>
				<Table size="small">
					<PosologyHead substanceUnit={substanceUnit} />
					<TableBody>
						{rows.map((posology, index) => (
							// iterate over object properties does not guarantee right ordering
							<StyledTableRow key={`table-row-${index}`}>
								<StyledTableCell align="center">
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
			</StyledTableContainer>
		</>
	);
}
