import { createChainHistoryProvider } from '../../../src/mina-explorer/chain-history'

const nodeUrl =
  process.env['ARCHIVE_NODE_URL'] || 'https://berkeley.graphql.minaexplorer.com'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'

describe('Mina Explorer Chain History Provider (Functional)', () => {
  let provider: ReturnType<typeof createChainHistoryProvider>

  beforeEach(() => {
    provider = createChainHistoryProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response).toHaveProperty('ok')
    })
  })

  describe('transactionsByAddresses', () => {
    it('should return transaction history for a public key', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.transactionsByAddresses({
        addresses: [publicKey]
      })
      console.log('Mina Explorer Chain History Provider Response', response)
      expect(response[0]).toHaveProperty('amount')
    })
  })

  //TODO: Other tests...
})
