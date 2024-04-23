import * as ibantools from 'ibantools';
import { ibanToBic } from '../src/index';

test('determines the correct BIC for an Austrian IBAN', () => {
  expect(ibanToBic('AT781400039828399259')).toBe('BAWAATWWXXX');
});

test('determines the correct BIC for a Belgian IBAN', () => {
  expect(ibanToBic('BE16897275256574')).toBe('VDSPBE91');
});

test('determines the correct BIC for a German IBAN', () => {
  expect(ibanToBic('DE51500105179975341634')).toBe('INGDDEFFXXX');
});

test('determines the correct BIC for a Luxembourgish IBAN', () => {
  expect(ibanToBic('LU280102886838719723')).toBe('FOTNLULL');
});

test('determines the correct BIC for a Dutch IBAN', () => {
  expect(ibanToBic('NL52ABNA9565235778')).toBe('ABNANL2A');
});

test('determines the correct BIC for a Spanish IBAN', () => {
  expect(ibanToBic('ES9121000418450200051332')).toBe('CAIXESBB');
});

test('determines the correct BIC for a French IBAN', () => {
  expect(ibanToBic('FR1420041010050500013M02606')).toBe('PSSTFRPPXXX');
});

test('returns undefined for an unknown bank code in a valid IBAN', () => {
  // this IBAN was handcrafted so that the checksum is correct, even though the bank code does not exist
  const iban = 'DE98500205175996372411';
  expect(ibantools.isValidIBAN(iban)).toBe(true);
  expect(ibanToBic(iban)).toBe(undefined);
});

test('returns undefined for an invalid IBAN', () => {
  expect(ibanToBic('not an IBAN')).toBe(undefined);
});
