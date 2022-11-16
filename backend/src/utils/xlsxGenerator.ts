import { MailData } from 'src/mail/dto/pharmaMail.dto';
import { utils, write } from 'xlsx';
import { defaultCellWidth, xlsxFilename } from './constants';

/**
 * Export the data provided in parameters into an excel file.
 * @param data Data to export in xlsx.
 * @returns An object containing the buffer formatted excel file and its filename.
 */
export const xlsx = async (data: MailData) => {
  const filename = xlsxFilename;
  const workbook = utils.book_new();
  workbook.Props = {
    Title: filename,
    CreatedDate: new Date(),
  };

  // participants worksheet
  const participants = [
    ...data.patientInfos,
    [''], // empty row (space)
    ...data.physicianInfos,
    [''],
    ...data.nof1PhysicianInfos,
  ];
  const wsParticipants = utils.aoa_to_sheet(participants);
  // determine column cell width
  const wsColsWidth = data.patientInfos[1].map((e) => ({
    wch: Math.max(e.length, defaultCellWidth),
  }));
  wsParticipants['!cols'] = wsColsWidth; // cells width
  utils.book_append_sheet(workbook, wsParticipants, 'Participants');

  // administration schema worksheet
  // header
  const wsSchema = utils.aoa_to_sheet(data.schemaHeaders);
  wsSchema['!merges'] = [
    { s: { c: 0, r: 0 }, e: { c: 2, r: 0 } }, // A1:C1
    { s: { c: 3, r: 0 }, e: { c: 5, r: 0 } }, // D1:F1
    { s: { c: 6, r: 0 }, e: { c: 8, r: 0 } }, // G1:I1
    { s: { c: 9, r: 0 }, e: { c: 11, r: 0 } }, // J1:L1
    { s: { c: 12, r: 0 }, e: { c: 14, r: 0 } }, // M1:O1
  ];
  // determine column widths using last header row
  const lastHeader = data.schemaHeaders[data.schemaHeaders.length - 1];
  const wsColsW = lastHeader.map((h) => ({
    wch: Math.max(h.length, defaultCellWidth),
  }));
  wsSchema['!cols'] = wsColsW;

  // data
  utils.sheet_add_json(wsSchema, data.schema, {
    skipHeader: true,
    origin: -1,
  });
  utils.sheet_add_aoa(wsSchema, [data.comments], {
    origin: { r: 0, c: lastHeader.length + 1 },
  });

  // add recap data to an offset position
  let offset = 0;
  data.substancesRecap.forEach((recap) => {
    utils.sheet_add_aoa(wsSchema, [[], ...recap], {
      origin: { r: 1 + offset, c: lastHeader.length + 1 },
    });
    offset += recap.length + 1;
  });

  utils.book_append_sheet(workbook, wsSchema, 'Administration schema');

  const xlsbuf: Buffer = write(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });

  return { filename, xlsbuf };
};
