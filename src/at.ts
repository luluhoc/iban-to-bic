import assert from 'assert';

import { writeOutputs, downloadCSV } from './utils';

export default async () => {
  let banks = await downloadCSV(
    'https://www.oenb.at/docroot/downloads_observ/sepa-zv-vz_gesamt.csv',
    { separator: ';' },
    'iso-8859-1',
    lines => {
      while (!lines[0].startsWith('Kennzeichen;')) lines.splice(0, 1);
      return lines;
    },
  );

  // filter by allowed sectors
  const allowedSectors = ['Raiffeisen', 'Aktienbanken', '§ 9 Institute', 'Sparkassen', 'Volksbanken'];
  banks = banks.filter(d => allowedSectors.includes(d.Sektor));

  // make sure that BLZ is unique
  assert.strictEqual(banks.length, new Set(banks.map(b => b.Bankleitzahl)).size);

  const bankCodesObj = banks.reduce((out, b) => {
    const ret: {
      code: string
      bic: string | null
      name: string
      addresses: {
        type: string
        streetAndNumber: string
        postalCode: string
        city: string
        poBoxNumber?: string
      }[]
      contacts: any
    } = {
      code: b.Bankleitzahl, // is unique
      bic: b['SWIFT-Code'] ? b['SWIFT-Code'] : null,
      name: b.Bankenname,
      addresses: [{ type: 'home', streetAndNumber: b['Straße'], postalCode: b.PLZ, city: b.Ort }],
      contacts: [
        ['Telefon', 'phone'],
        ['Fax', 'fax'],
        ['E-Mail', 'email'],
        ['Homepage', 'url'],
      ].reduce((contacts, [kOrig, kNew]) => {
        // @ts-expect-error  
        if (b[kOrig]) contacts[kNew] = b[kOrig];
        return contacts;
      }, {}),
    };

    // banks can have a separate postal address
    if (b['Postadresse / PLZ'] && b['Postadresse / Ort']) {
      const post: {
        [key: string]: string | number
      } = { type: 'post', postalCode: b['Postadresse / PLZ'], city: b['Postadresse / Ort'] };
      if (b['Postadresse / Straße']) post.streetAndNumber = b['Postadresse / Straße'];
      if (b.Postfach) post.poBoxNumber = b.Postfach;
      // @ts-expect-error
      ret.addresses.push(post);
    }
    // @ts-expect-error
    out[ret.code] = ret;
    return out;
  }, {});

  await writeOutputs('at', bankCodesObj);
};
