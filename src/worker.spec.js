const assert = require('chai').assert
const sinon = require('sinon')
const axios = require('axios')
const config = require('config')
const normalize = require('x-cryptocurrencies-normalizr')

const Worker = require('./worker')
const Data = require('./utils/sequelize').Data

describe('worker', () => {
  const stubRequest = sinon.stub(axios, 'get')
  const stubData = sinon.stub(Data, 'create')

  beforeEach(() => {
    stubRequest.reset()
    stubData.reset()
  })

  after(() => {
    stubRequest.restore()
    stubData.restore()
  })

  it('get data', (done) => {
    const normalizedSymbol = 'BTC-BCH'
    const denormalizedSymbol = 'BCCBTC'

    stubRequest.resolves({data: {price: '1.01230', symbol: denormalizedSymbol}})

    Worker.getData(normalizedSymbol).then((response) => {
      assert.strictEqual(stubRequest.calledOnce, true, 'request was called once')
      assert.strictEqual(
        stubRequest.calledWith(`${config.api.url}?symbol=${denormalizedSymbol}`),
        true,
        'called with API URL and symbol'
      )

      done()
    })
  })

  it('start worker in single-mode', (done) => {
    const pairs = config.collect.pairs.split(',')
    let validPairs = []

    for (let i = 0; i < pairs.length; i++) {
      let normalizedPair = pairs[i]
      let exchangePair = normalize.denormalize.pair(normalizedPair, config.get('exchange').name)

      if (exchangePair !== normalizedPair) {
        validPairs.push(exchangePair)
      }
    }

    stubRequest.resolves({data: {price: '1.01230', symbol: validPairs[0]}})

    Worker.start().then(() => {
      assert.strictEqual(stubData.callCount, validPairs.length, 'saved data for each pair')

      assert.strictEqual(stubRequest.callCount, validPairs.length, 'request was called for each pair')
      assert.strictEqual(
        stubRequest.firstCall.calledWith(`${config.api.url}?symbol=${validPairs[0]}`),
        true,
        'called with API URL and symbol'
      )

      done()
    })
  })
})
