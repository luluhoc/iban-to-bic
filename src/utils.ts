import assert from 'assert';
import path from 'path';
import fs from 'fs-extra';
import fetch, { RequestInfo } from 'node-fetch-commonjs';
import xlsx from 'xlsx';
import { JSDOM } from 'jsdom';
import * as ibantools from 'ibantools';
import neatCsv from 'neat-csv';
import iconv from 'iconv-lite';

// maps column index starting at 0 to A,...,Z,AA,AB,...,ZY,ZZ
export function columnCode(col: number) {
  assert(col >= 0 && col < 26 + 26 * 26);
  const letter = (n:number) => String.fromCharCode(n + 'A'.charCodeAt(0));
  if (col < 26) return letter(col);
  return letter(Math.floor(col / 26) - 1) + letter(col % 26);
}

// col counted from 0, row counted from 1
export function getCellValue(worksheet: { [x: string]: any; }, col: number, row: any) {
  const v = worksheet[`${columnCode(col)}${row}`];
  return v ? v.v : v;
}

export async function writeOutputs(name: string, bankCodesObj: { [s: string]: unknown; } | ArrayLike<unknown>) {
  await fs.writeJSON(path.join(__dirname, `../../datasets-extended/${name}.json`), bankCodesObj);

  // @ts-expect-error
  const bankCodesToBic = Object.entries(bankCodesObj).reduce((prev, [code, { bic, branches }]) => {
      // @ts-expect-error
    if (bic) prev[code] = bic;
      // @ts-expect-error
    else if (branches && branches[0] && branches[0].bic) prev[code] = branches[0].bic;
  // @ts-expect-error
    if (prev[code]) assert(ibantools.isValidBIC(prev[code]), 'invalid BIC: ' + prev[code]);

    return prev;
  }, {});
  await fs.writeJSON(path.join(__dirname, `../datasets/${name}.json`), bankCodesToBic);
}

export async function downloadXLSX(url: URL | RequestInfo, sheet: string | number) {
  const doc = xlsx.read(await (await fetch(url)).buffer(), { type: 'buffer' });
  return sheet ? doc.Sheets[sheet] : doc;
}

export async function downloadJSDOM(url: URL | RequestInfo) {
  return new JSDOM(await (await fetch(url)).text()).window.document;
}

export async function downloadCSV(url: URL | RequestInfo, options: neatCsv.Options | undefined, encoding: string, linesModifier?: { (lines: any): any; (arg0: string[]): any[]; }) {
  const fetchRes = await fetch(url);
  let text;
  if (encoding) {
    text = iconv.decode(await fetchRes.buffer(), encoding);
  } else {
    text = await fetchRes.text();
  }
  text = text.split('\r').join('');
  if (linesModifier) text = linesModifier(text.split('\n')).join('\n');
  return neatCsv(text, options);
}

export function assertTableHead(worksheet: { [x: string]: any; }, row: any, values: string | any[]) {
  for (let i = 0; i < values.length; i++) {
    assert.strictEqual(getCellValue(worksheet, i, row), values[i]);
  }
}
