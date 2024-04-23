import assert from 'assert';
import { getCellValue, writeOutputs, downloadXLSX, assertTableHead } from './utils';

function rowToObject(worksheet: any, row: any) {
  const col =(n: number) => getCellValue(worksheet, n, row);
  return {
    bic: col(0),
    code: col(1),
    name: col(2),
  };
}

export default async () => {
  const worksheet = await downloadXLSX(
    'https://www.betaalvereniging.nl/wp-content/uploads/BIC-lijst-NL.xlsx',
    'BIC-lijst',
  );

  // @ts-expect-error
  assert.strictEqual(worksheet['A1'].v, 'BIC-lijst-NL');
  assertTableHead(worksheet, 4, ['BIC', 'Identifier', 'Naam betaaldienstverlener']);

  const bankCodesObj: {
    [s: string]: {
      bic: string
      code: string
      name: string
    }
  } = {};
   // @ts-expect-error
  for (let i = 5; worksheet['A' + i] !== undefined; i++) {
    const row = rowToObject(worksheet, i);
    assert(bankCodesObj[row.code] === undefined);
    bankCodesObj[row.code] = row;
  }

  await writeOutputs('nl', bankCodesObj);
};
