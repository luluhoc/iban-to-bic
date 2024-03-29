const at = require('./at');
const be = require('./be');
const de = require('./de');
const frEs = require('./fr-es');
const lu = require('./lu');
const nl = require('./nl');

(async () => {
  await Promise.all([at(), be(), frEs(), lu(), nl()]);
})();
