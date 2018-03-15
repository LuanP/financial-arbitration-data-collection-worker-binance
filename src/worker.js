const R = require('ramda')
const axios = require('axios')
const config = require('config')
const normalize = require('x-cryptocurrencies-normalizr')
const logger = require('./utils/logging').logger
const Data = require('./utils/sequelize').Data

const Worker = () => {}

Worker.blackList = []

Worker.getData = async (normalizedPair) => {
  /*
   * The `normalizedPair` parameter is normalized accross all workers
   * since we can't send the request with that value
   * we must first denormalize it
  * */

  let url = config.api.url
  let exchangePair
  if (normalizedPair) {
    exchangePair = normalize.denormalize.pair(normalizedPair, config.get('exchange').name)
    url += `?symbol=${exchangePair}`
  }

  if (normalizedPair === exchangePair) {
    // pair does not exist since exchange pair demands changes
    Worker.blackList.push(normalizedPair)
    return undefined
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
      if (err.response.status === 400) {
        Worker.blackList.push(normalizedPair)
      }

      logger.error(
        `error requesting ${url}.
         Status: ${err.response.status}.
         Error: ${JSON.stringify(err.response.data)}`
      )
    })
}

Worker.call = async () => {
  const requestList = []

  if (config.collect.onlyMatches === true) {
    let pairs = normalize.findMatches()

    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i]

      if (R.indexOf(pair, Worker.blackList) > -1) {
        continue
      }

      requestList.push(
        Worker.getData(pair)
      )
    }
  } else if (config.collect.specificPrices === false) {
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

      if (R.indexOf(coinPair, Worker.blackList) > -1) {
        continue
      }

      requestList.push(
        Worker.getData(coinPair)
      )
    }
  }

  return Promise.all(requestList)
    .then(async (responses) => {
      for (let i = 0; i < responses.length; i++) {
        let response = responses[i]

        if (!response) {
          continue
        }

        logger.debug(response)
        await Data.create(response)
      }
    })
    .catch((err) => {
      logger.error(err)
    })
}

Worker.start = () => {
  logger.info(`starting with ${config.running.mode} mode and interval set to ${config.interval}`)

  return new Promise((resolve, reject) => {
    if (config.running.mode === 'single-time' || config.interval === undefined) {
      Worker.call()
        .then(() => resolve())
        .catch((err) => {
          logger.error(err)
          return reject(err)
        })
      return
    }

    setInterval(Worker.call, config.interval)
    return resolve()
  })
}

module.exports = Worker
