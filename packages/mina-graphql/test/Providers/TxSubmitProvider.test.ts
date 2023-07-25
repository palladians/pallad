import { expect } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

import { TxSubmitGraphQLProvider } from '../../src/Providers/TxSubmit/TxSubmitProvider'
const minaTxSubmitGql = 'https://proxy.devnet.minaexplorer.com/' // Needs a different API than the explorer

describe('TxSubmitGraphQLProvider for Testnet', () => {
  // Test to check if the provider health check function works as expected
  test('healthCheck', async () => {
    const provider = new TxSubmitGraphQLProvider(minaTxSubmitGql)
    const response = await provider.healthCheck()

    expect(response).toEqual({ ok: true })
  })
})
