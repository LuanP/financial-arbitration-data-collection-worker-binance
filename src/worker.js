const R = require('ramda')
const axios = require('axios')
const config = require('config')
const normalize = require('x-cryptocurrencies-normalizr')
const logger = require('./utils/logging').logger
const Data = require('./utils/sequelize').Data

const Worker = () => {}

Worker.getData = async (normalizedPair) => {
  /*
   * The `normalizedPair` parameter is normalized accross all workers
   * since we can't send the request with that value
   * we must first denormalize it
  * */

  // https://api.binance.com/api/v3/ticker/price
  let url = config.api.url
  if (normalizedPair) {
    let exchangePair = normalize.denormalize.pair(normalizedPair, config.get('exchange').name)
    url += `?symbol=${exchangePair}`
  }

  const normalizedPairList = normalizedPair.split('-')

  return axios.get(url)
    .then((res) => {
      return {
        baseAsset: normalizedPairList[0],
        quoteAsset: normalizedPairList[1],
        normalizedPair: normalizedPair,
        denormalizedPair: res.data.symbol,
        price: res.data.price
      }
    })
    .catch((err) => {
      logger.error(
        `error requesting ${url}.
         Error: ${err}`
      )
    })
}

Worker.call = async () => {
  const requestList = []

  if (config.collect.specificPrices === false) {
    // collect all prices available
    requestList.push(
      Worker.getData()
    )
  } else {
    // collect only a given set of pairs
    if (config.collect.pairs === undefined) {
      throw new Error(
        `in order to collect specific prices you must set \`COLLECT_PAIRS\` with comma separated pairs.
         e.g.: export COLLECT_PAIRS=BTC-ETH,BTC-IOTA,ETH-IOTA
        `
      )
    }

    const coinPairs = R.split(',', config.collect.pairs)

    for (let i = 0; i < coinPairs.length; i++) {
      let coinPair = coinPairs[i]

      requestList.push(
        Worker.getData(coinPair)
      )
    }
  }

  return Promise.all(requestList)
    .then(async (responses) => {
      for (let i = 0; i < responses.length; i++) {
        let response = responses[i]

        logger.debug(response)
        await Data.create(response)

        const allValues = await Data.findAll()
        R.map((obj) => logger.debug(obj.toJSON()), allValues)
      }
    })
    .catch((err) => {
      logger.error(err)
    })
}

Worker.start = () => {
  logger.info(`starting with ${config.running.mode} mode and interval set to ${config.interval}`)
  if (config.running.mode === 'single-time' || config.interval === undefined) {
    Worker.call()
      .catch((err) => logger.error(err))
    return
  }

  setInterval(Worker.call, config.interval)
}

module.exports = Worker
