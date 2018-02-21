const R = require('ramda')
const axios = require('axios')
const config = require('config')
const normalize = require('x-cryptocurrencies-normalizr')

const Worker = () => {}

Worker.getData = async (coinPair) => {
  /*
   * The `coinPair` parameter is normalized
   * since we can't send the request with that value
   * we must first denormalize it
  * */

  // https://api.binance.com/api/v3/ticker/price
  let url = config.api.url
  if (coinPair) {
    let exchangeCoinPair = normalize.denormalize.pair(coinPair, config.exchange.name)
    url += `?symbol=${exchangeCoinPair}`
  }

  return axios.get(url)
    .catch((err) => {
      console.error(
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
    .then((responses) => {
      for (let i = 0; i < responses.length; i++) {
        let response = responses[i]

        console.log(response.data)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

Worker.start = () => {
  if (config.interval === undefined) {
    Worker.call()
      .catch((err) => console.error(err))
    return
  }

  setInterval(Worker.call, config.interval)
}

module.exports = Worker
