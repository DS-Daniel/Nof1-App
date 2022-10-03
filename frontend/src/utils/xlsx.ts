import { utils, writeFileXLSX } from 'xlsx';

const defaultCellWidth = 12;

/**
 * Export data to a XLSX file and trigger the file download.
 * @param filename Filename.
 * @param rows Array of data to export.
 * @param headers Array containing data header.
 */
export const generateXLSX = async (
	filename: string,
	rows: any[],
	headers: string[],
) => {
	const workbook = utils.book_new();
	workbook.Props = {
		Title: filename,
		CreatedDate: new Date(),
	};

	const worksheet = utils.aoa_to_sheet([headers]);
	utils.sheet_add_json(worksheet, rows, {
		skipHeader: true,
		origin: -1,
	});

	const colsWidth = headers.map((h) => ({
		wch: Math.max(h.length, defaultCellWidth),
	}));
	worksheet['!cols'] = colsWidth;

	utils.book_append_sheet(workbook, worksheet, filename);

	writeFileXLSX(workbook, `${filename}.xlsx`);
};
