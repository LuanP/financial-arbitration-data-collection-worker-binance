const path = require('path')
const env = process.env.NODE_ENV || 'development'
const root = path.join(__dirname, '..', '..')

try {
  require('dotenv').config({path: path.join(root, `.env-${env.toLowerCase()}`)})
} catch (err) {
  console.log(err)
}

const base = {
  exchange: {
    name: process.env.EXCHANGE_NAME,
    symbol: {
      delimiter: process.env.SYMBOL_DELIMITER
    }
  },
  api: {
    url: process.env.API_URL
  },
  collect: {
    specificPrices: process.env.COLLECT_SPECIFIC_PRICES === 'true',
    pairs: process.env.COLLECT_PAIRS
  },
  interval: parseFloat(process.env.INTERVAL_IN_SECONDS || 300) * 1000
}

module.exports = base
