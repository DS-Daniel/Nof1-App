import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getComparator, Order } from '../../utils/tableSorting';
import EnhancedTableHead, { HeadCell } from '../common/TableHead';
import { useState } from 'react';
import Nof1TableItem from './Nof1TableItem';
import { Nof1Test } from '../../entities/nof1Test';
import { Nof1TableInterface } from '../../pages/nof1';
import useTranslation from 'next-translate/useTranslation';

const rowsPerPageOptions = [5, 10, 25];

type Nof1TableProps = {
	headCells: readonly HeadCell<Nof1TableInterface>[];
	rows: Nof1TableInterface[];
	data: Nof1Test[];
};

/**
 * Table component to display all user's N-of-1 tests.
 */
export default function Nof1Table({ headCells, rows, data }: Nof1TableProps) {
	const { t } = useTranslation('common');
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] =
		useState<keyof Nof1TableInterface>('creationDate');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

	/**
	 * Sort the table according to the property clicked.
	 * @param event Mouse event (not used)
	 * @param property Property which define the order.
	 */
	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof Nof1TableInterface,
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

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

		/**
		 * Retrieve the test from its id.
		 * @param id Id of the test.
		 * @returns A Nof1 test.
		 */
	const getItemData = (id: string) => {
		return data.find((test) => test.uid === id)!;
		// ids are generated from data, thus 'find' will always return an element
	};

	return (
		<Box sx={{ width: '100%', my: '2rem' }}>
			<Paper sx={{ width: '100%' }}>
				<TableContainer>
					<Table
						sx={{ minWidth: 600 }}
						aria-labelledby="tableTitle"
						size="medium"
					>
						<EnhancedTableHead
							headCells={headCells}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{rows
								.slice()
								.sort(getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const labelId = `enhanced-table-${index}`;
									return (
										<Nof1TableItem
											item={getItemData(row.id)}
											labelId={labelId}
											key={row.id}
										/>
									);
								})}
							{
								/* row padding to keep table aspect ratio */
								emptyRows > 0 && (
									<TableRow
										style={{
											height: 125 * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
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
			</Paper>
		</Box>
	);
}
