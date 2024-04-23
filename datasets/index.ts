const datasets: {
  [key: string]: {
    [key: string]: string
  }
} = {
  AT: require('./at.json'),
  BE: require('./be.json'),
  DE: require('./de.json'),
  ES: require('./es.json'),
  FR: require('./fr.json'),
  LU: require('./lu.json'),
  NL: require('./nl.json'),
};

export default datasets
