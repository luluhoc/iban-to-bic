import * as ibantools from 'ibantools';
import datasets from '../datasets';

export const ibanIsValid = (iban: string) => { 
  
  const ib = ibantools.electronicFormatIBAN(iban);
  if (!ib) return false;
  return ibantools.isValidIBAN(ib);
}

export const ibanToBic = (iban: string) => {
  const ib = ibantools.electronicFormatIBAN(iban);
  if (!ib) return;
  if (!ibantools.isValidIBAN(ib)) return;

  const country = ib.slice(0, 2);
  if (!datasets[country]) return;

  // see https://en.wikipedia.org/wiki/International_Bank_Account_Number#IBAN_formats_by_country
  let bankCode: string | undefined;
  if (country === 'AT') bankCode = iban.substr(4, 5);
  else if (country === 'BE') bankCode = iban.substr(4, 3);
  else if (country === 'DE') bankCode = iban.substr(4, 8);
  else if (country === 'ES') bankCode = iban.substr(4, 4);
  else if (country === 'FR') bankCode = iban.substr(4, 5);
  else if (country === 'LU') bankCode = iban.substr(4, 3);
  else if (country === 'NL') bankCode = iban.substr(4, 4);
  if (!bankCode) return;

  return datasets[country][bankCode];
}
