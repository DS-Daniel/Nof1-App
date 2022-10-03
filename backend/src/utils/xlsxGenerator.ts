import { MailData } from 'src/mail/dto/mail.dto';
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
  // comma for empty row (space)
  const participants = [
    ...data.patientInfos,
    ,
    ...data.physicianInfos,
    ,
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
    utils.sheet_add_aoa(wsSchema, [, ...recap], {
      origin: { r: 0 + offset, c: 12 },
    });
    offset += 4;
  });
  const wsColsW = data.schemaHeaders.map((h) => ({
    wch: Math.max(h.length, defaultCellWidth),
  }));
  wsSchema['!cols'] = wsColsW;
  utils.book_append_sheet(workbook, wsSchema, 'Administration schema');

  const xlsbuf: Buffer = write(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });

  return { filename, xlsbuf };
};
