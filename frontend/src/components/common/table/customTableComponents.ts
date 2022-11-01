import TableContainer, {
	TableContainerProps,
} from '@mui/material/TableContainer';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableHead, { TableHeadProps } from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';

interface StyledTableCellProps extends TableCellProps {
	borderR: boolean;
}

// custom TableCell component
export const StyledTableCell = styled(TableCell, {
	shouldForwardProp: (prop) => prop !== 'borderR',
})<StyledTableCellProps>(({ borderR, theme }) => ({
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
export const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
}));

// custom TableContainer component
export const StyledTableContainer = styled(TableContainer)<TableContainerProps>(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: `${theme.shape.borderRadius * 2}px ${
			theme.shape.borderRadius * 2
		}px 0 0`,
	}),
);

// custom TableHead component
export const ThemedTableHead = styled(TableHead)<TableHeadProps>(
	({ theme }) => ({
		backgroundColor: theme.palette.primary.light,
	}),
);
