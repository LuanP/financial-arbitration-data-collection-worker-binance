const assert = require('chai').assert
const sinon = require('sinon')
const axios = require('axios')
const config = require('config')

const Worker = require('./worker')

describe('worker', () => {
  const stubRequest = sinon.stub(axios, 'get')

  beforeEach(() => {
    stubRequest.reset()
  })

  after(() => {
    stubRequest.restore()
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
})
