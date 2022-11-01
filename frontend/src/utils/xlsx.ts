import { utils, writeFileXLSX } from 'xlsx';
import { AdministrationSchema } from '../entities/nof1Test';

const defaultCellWidth = 12;

/**
 * Exports data to a XLSX file and triggers the file download.
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

/**
 * Exports an exemple of the administration schema xlsx file that will be
 * generated and sent to the pharmacy.
 * @param data Data to export in xlsx.
 */
export const administrationSchemaXlsx = async (data: {
	patientInfos: string[][];
	physicianInfos: string[][];
	nof1PhysicianInfos: string[][];
	schemaHeaders: string[];
	schema: AdministrationSchema;
	substancesRecap: (string | number)[][][];
}) => {
	const filename = 'Administration_schema_exemple.xlsx';
	const workbook = utils.book_new();
	workbook.Props = {
		Title: filename,
		CreatedDate: new Date(),
	};
	// comma for empty row (space)
	const participants = [
		...data.patientInfos,
		[''],
		...data.physicianInfos,
		[''],
		...data.nof1PhysicianInfos,
	];
	// participants worksheet
	const wsParticipants = utils.aoa_to_sheet(participants);
	// determine column cell width
	const wsColsWidth = data.patientInfos[1].map((e) => ({
		wch: Math.max(e.length, defaultCellWidth),
	}));
	wsParticipants['!cols'] = wsColsWidth; // cells width
	utils.book_append_sheet(workbook, wsParticipants, 'Participants');

	// administration schema worksheet
	const wsSchema = utils.aoa_to_sheet([data.schemaHeaders]);
	utils.sheet_add_json(wsSchema, data.schema, {
		skipHeader: true,
		origin: -1,
	});
	// add data to an offset position
	let offset = 0;
	data.substancesRecap.forEach((recap) => {
		utils.sheet_add_aoa(wsSchema, [[], ...recap], {
			origin: { r: 0 + offset, c: 12 },
		});
		offset += 4;
	});
	const wsColsW = data.schemaHeaders.map((h) => ({
		wch: Math.max(h.length, defaultCellWidth),
	}));
	wsSchema['!cols'] = wsColsW;
	utils.book_append_sheet(workbook, wsSchema, 'Administration schema');

	writeFileXLSX(workbook, filename);
};
