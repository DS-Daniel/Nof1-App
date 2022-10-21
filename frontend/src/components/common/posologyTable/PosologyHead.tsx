import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useTranslation from 'next-translate/useTranslation';

// custom TableCell component
const StyledTableCell = styled(TableCell, {
	shouldForwardProp: (prop) => prop !== 'borderR',
})<{
	borderR: boolean;
}>(({ borderR, theme }) => ({
	// [`&.${tableCellClasses.head}`]: {
	// 	color: theme.palette.common.white,
	// 	borderRight: '1px solid',
	// },
	// '&.MuiTableCell-root': {
	// 	borderRight: '1px solid',
	// },
	...(borderR && { borderRight: '1px solid' }),
	borderColor: theme.palette.divider,
}));

interface PosologyHeadProps {
	substanceUnit: string;
}

export default function PosologyHead({ substanceUnit }: PosologyHeadProps) {
	const { t } = useTranslation('common');
	const headers0 = [
		t('posology-table.morning'),
		t('posology-table.noon'),
		t('posology-table.evening'),
		t('posology-table.night'),
	];
	const col = [
		t('posology-table.dose', { unit: substanceUnit }),
		t('posology-table.fraction'),
	];
	const headers = [t('posology-table.day'), ...col, ...col, ...col, ...col];

	return (
		<TableHead sx={{ bgcolor: 'primary.light' }}>
			<TableRow>
				<StyledTableCell padding="none" borderR></StyledTableCell>
				{headers0.map((h, idx) => (
					<StyledTableCell
						key={`posology-header0-${idx}`}
						align="center"
						colSpan={2}
						borderR={idx + 1 !== headers0.length}
					>
						<Typography fontWeight="bold">{h}</Typography>
					</StyledTableCell>
				))}
			</TableRow>
			<TableRow sx={{ border: 0 }}>
				{headers.map((header, index) => (
					<StyledTableCell
						key={`posology-header1-${index}`}
						align="center"
						padding="none"
						// prettier-ignore
						borderR={(index % 2 === 0) && (index + 1 !== headers.length)}
					>
						<Typography variant="body2" fontWeight="bold">
							{header}
						</Typography>
					</StyledTableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
