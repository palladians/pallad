import { expect } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

import { TxSubmitGraphQLProvider } from '../../../src/mina-explorer/tx-submit/TxSubmitProvider'

const nodeUrl =
  process.env['NODE_URL'] || 'https://proxy.devnet.minaexplorer.com/'
console.log('Using node url:', nodeUrl)

describe('TxSubmitGraphQLProvider for Testnet', () => {
  // Test to check if the provider health check function works as expected
  test('healthCheck', async () => {
    const provider = new TxSubmitGraphQLProvider(nodeUrl)
    const response = await provider.healthCheck()

    expect(response).toEqual({ ok: true })
  })
  // TODO: add transaction submission test & transaction submission failure test
})
