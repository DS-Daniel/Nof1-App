import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ThemedTableHead } from './customTableComponents';

const rowsPerPageOptions = [10, 20, 30];

interface ReadOnlyTableProps {
	headers: string[];
	rows: JSX.Element[][];
	emptyCellHeight: number;
}

/**
 * Common read only table component, with pagination options.
 */
export default function ReadOnlyTableWPages({
	headers,
	rows,
	emptyCellHeight,
}: ReadOnlyTableProps) {
	const { t } = useTranslation('common');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

	/**
	 * Handle table page change.
	 * @param event Not used
	 * @param newPage New page number.
	 */
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	/**
	 * Change the number of rows displayed by the table.
	 * @param event HTML event containing the number of rows.
	 */
	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<>
			<TableContainer>
				<Table size="small">
					<ThemedTableHead>
						<TableRow>
							{headers.map((header, index) => (
								<TableCell key={`table-header-${index}`} align="center">
									<Typography variant="body1" fontWeight="bold">
										{header}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</ThemedTableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => (
								<TableRow key={index}>{row}</TableRow>
							))}
						{
							/* row padding to keep table aspect ratio */
							emptyRows > 0 && (
								<TableRow
									style={{
										height: emptyCellHeight * emptyRows,
									}}
								>
									<TableCell colSpan={12} />
								</TableRow>
							)
						}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				labelRowsPerPage={t('table.labelRowsPerPage')}
				labelDisplayedRows={({ from, to, count }) =>
					`${from}–${to} ${t('table.ofLabel')} ${
						count !== -1 ? count : `${t('table.moreLabel')} ${to}`
					}`
				}
				rowsPerPageOptions={rowsPerPageOptions}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	);
}
