const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const xlsx = require('xlsx');
const { JSDOM } = require('jsdom');

// maps column index starting at 0 to A,...,Z,AA,AB,...,ZY,ZZ
function columnCode(col) {
  assert(col >= 0 && col < 26 + 26 * 26);
  const letter = n => String.fromCharCode(n + 'A'.charCodeAt(0));
  if (col < 26) return letter(col);
  return letter(Math.floor(col / 26) - 1) + letter(col % 26);
}

// col counted from 0, row counted from 1
function getCellValue(worksheet, col, row) {
  const v = worksheet[`${columnCode(col)}${row}`];
  return v ? v.v : v;
}

async function writeOutputs(name, bankCodesObj) {
  await fs.writeJSON(path.join(__dirname, `../datasets-extended/${name}.json`), bankCodesObj);

  const bankCodesToBic = Object.entries(bankCodesObj).reduce((prev, [code, { bic, branches }]) => {
    if (bic) prev[code] = bic;
    else if (branches && branches[0] && branches[0].bic) prev[code] = branches[0].bic;
    return prev;
  }, {});

  await fs.writeJSON(path.join(__dirname, `../datasets/${name}.json`), bankCodesToBic);
}

async function downloadXLSX(url, sheet) {
  const doc = xlsx.read(await (await fetch(url)).buffer(), { type: 'buffer' });
  return sheet ? doc.Sheets[sheet] : doc;
}

async function downloadJSDOM(url) {
  return new JSDOM(await (await fetch(url)).text()).window.document;
}

module.exports = { columnCode, getCellValue, writeOutputs, downloadXLSX, downloadJSDOM };
