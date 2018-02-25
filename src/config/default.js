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
    name: process.env.EXCHANGE_NAME || 'binance',
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
  interval: parseFloat(process.env.INTERVAL_IN_SECONDS || 300) * 1000,
  running: {
    mode: process.env.RUNNING_MODE || 'worker'
  },
  db: {
    knex: {
      dialect: 'mysql2',
      tablename: 'knex_migrations'
    },
    name: process.env.DB_NAME || 'db',
    username: process.env.DB_USERNAME || 'worker',
    password: process.env.DB_PASSWORD || 'worker',
    options: {
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      debug: process.env.DB_DEBUG || false,
      logging: process.env.DB_LOGGING || undefined,
      pool: {
        max: process.env.DB_POOL_MAX || 20,
        min: process.env.DB_POOL_MIN || 5,
        idle: process.env.DB_POOL_IDLE || 10000
      }
    }
  },
  logging: {
    level: process.env.LOGGING_LEVEL || 'debug',
    project: {
      name: 'x-financial-arbitration-data-collection-worker-binance'
    }
  }
}

module.exports = base
