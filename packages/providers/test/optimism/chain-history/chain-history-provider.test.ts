import { Optimism } from '../../../src'

const nodeUrl =
  process.env['OPTIMISM_ARCHIVE_NODE_URL'] ||
  'wss://optimism-sepolia-rpc.publicnode.com'
const transactionHash =
  process.env['TX_HASH'] ||
  '0x105bf755a57f5f1e70784dd2ce811795e44a443608879e499d459098fb80f560'

describe('Optimism Chain History Provider (Functional)', () => {
  let provider: ReturnType<typeof Optimism.createChainHistoryProvider>

  beforeEach(() => {
    provider = Optimism.createChainHistoryProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe('transactions receipt', () => {
    it('should return transaction receipt for a transaction hash', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.transactionsByHashes({
        ids: [transactionHash]
      })

      console.log('Optimism Chain History Provider Response', response)

      expect(response).toHaveProperty('blockNumber')
      expect(response).toHaveProperty('blockHash')
    })
  })

  //TODO: Other tests...
})
