const assert = require('chai').assert
const sinon = require('sinon')
const axios = require('axios')
const config = require('config')

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
    const normalizedSymbol = 'BCH-BTC'
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
    const denormalizedSymbol = 'BCCBTC'

    stubRequest.resolves({data: {price: '1.01230', symbol: denormalizedSymbol}})

    Worker.start().then(() => {
      assert.strictEqual(stubData.calledTwice, true, 'saved data for each pair')

      assert.strictEqual(stubRequest.calledTwice, true, 'request was called once')
      assert.strictEqual(
        stubRequest.calledWith(`${config.api.url}?symbol=${denormalizedSymbol}`),
        true,
        'called with API URL and symbol'
      )

      done()
    })
  })
})
