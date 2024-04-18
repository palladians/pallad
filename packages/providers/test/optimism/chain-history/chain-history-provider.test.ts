import { Optimism } from '../../../src'

const nodeUrl =
  process.env['OPTIMISM_NODE_URL'] ||
  'wss://optimism-sepolia-rpc.publicnode.com'
const archiveNodeurl =
  process.env['OPTIMISM_ARCHIVE_NODE_URL'] ||
  'https://api-sepolia-optimism.etherscan.io/' //'https://api.etherscan.io/'
const publicKey =
  process.env['PUBLIC_KEY'] || '0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9'
const transactionHash =
  process.env['TX_HASH'] ||
  '0x105bf755a57f5f1e70784dd2ce811795e44a443608879e499d459098fb80f560'

describe('Optimism Chain History Provider (Functional)', () => {
  let provider: ReturnType<typeof Optimism.createChainHistoryProvider>

  beforeEach(() => {
    provider = Optimism.createChainHistoryProvider(nodeUrl, archiveNodeurl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe('transactions history', () => {
    it('should return transaction receipt for a transaction hash', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.transactionsByAddresses({
        addresses: [publicKey]
      })
      expect(response[0]).toHaveProperty('blockNumber')
    })
  })

  describe.skip('transactions receipt', () => {
    it('should return transaction receipt for a transaction hash', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.transactionsByHashes({
        ids: [transactionHash]
      })
      expect(response).toHaveProperty('blockNumber')
      expect(response).toHaveProperty('blockHash')
    })
  })

  //TODO: Other tests...
})
