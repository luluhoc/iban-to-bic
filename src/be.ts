import assert from 'assert';
import { getCellValue, writeOutputs, downloadXLSX, assertTableHead } from './utils';
import { WorkBook, WorkSheet } from 'xlsx';

function rowToObject(worksheet: WorkBook | WorkSheet, row: string) {
  const col = (n:number) => getCellValue(worksheet, n, row);
  return {
    code: col(0),
    bic: col(1).replace(/ /g, ''),
    name: {
      nl: col(2) || undefined,
      fr: col(3) || undefined,
      de: col(4) || undefined,
      en: col(5) || undefined,
    },
  };
}

export default async () => {
  const worksheet = await downloadXLSX(
    'https://www.nbb.be/doc/be/be/protocol/r_fulllist_of_codes_current.xlsx',
    'Q_FULL_LIST_XLS_REPORT',
  );

  assertTableHead(worksheet, 2, [
    'T_Identification_Number',
    'Biccode',
    'T_Institutions_Dutch',
    'T_Institutions_French',
    'T_Institutions_German',
    'T_Institutions_English',
  ]);

  const bankCodesObj = {};

  // @ts-expect-error
  for (let i = 3; worksheet['A' + i] !== undefined; i++) {
    // @ts-expect-error
    const row = rowToObject(worksheet, i);
    if (['VRIJ', 'VRIJ-LIBRE'].indexOf(row.bic) !== -1) continue;
    if (['nav', 'NAV', 'NAP', 'NYA', '-'].indexOf(row.bic) !== -1) delete row.bic;
   // @ts-expect-error
    assert(bankCodesObj[row.code] === undefined);
    // @ts-expect-error
    bankCodesObj[row.code] = row;
  }

  await writeOutputs('be', bankCodesObj);
};
