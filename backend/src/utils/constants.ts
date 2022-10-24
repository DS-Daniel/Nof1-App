// REGEX
export const cityRegex = /^[A-Za-z' \-à-öù-ÿ]+$/gm;
export const streetRegex = /^\d*[A-Za-z' ,.\-à-öù-ÿ]+\d*$/gm;

// ENUMS
export enum TestStatus {
  Draft = 'draft',
  Preparation = 'preparation',
  Ready = 'ready',
  Ongoing = 'ongoing',
  Ended = 'ended',
  Interrupted = 'interrupted',
}

// EXCEL file constants
export const xlsxFilename = 'N-of-1.xlsx';
export const defaultCellWidth = 12;
