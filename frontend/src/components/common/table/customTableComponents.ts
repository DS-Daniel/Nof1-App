import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';

// custom TableCell component
export const StyledTableCell = styled(TableCell, {
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

// custom TableRow component
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	// '&:last-child td, &:last-child th': {
	//   border: 0,
	// },
}));

// custom TableContainer component
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: `${theme.shape.borderRadius * 2}px ${
		theme.shape.borderRadius * 2
	}px 0 0`,
}));

// custom TableHead component
export const OrangeTableHead = styled(TableHead)(({ theme }) => ({
	backgroundColor: theme.palette.primary.light,
}));