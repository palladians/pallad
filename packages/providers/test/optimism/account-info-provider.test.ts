import { TokenIdMap } from '@palladxyz/mina-core'

import { Optimism } from '../../src'

const nodeUrl = process.env['NODE_URL'] || 'https://sepolia.optimism.io'
const publicKey =
  process.env['PUBLIC_KEY'] || '0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9'

// TODO: change this to local network
describe('Optimism Account Info Provider (Functional)', () => {
  let provider: ReturnType<typeof Optimism.createAccountInfoProvider>
  let tokenMap: TokenIdMap

  beforeEach(() => {
    provider = Optimism.createAccountInfoProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe('getAccountInfo', () => {
    it('should return account info for a valid public key', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.getAccountInfo({ publicKey, tokenMap })
      console.log('Optimism AccountInfo Provider Response', response)
      expect(response).toHaveProperty('ETH')
    })
  })

  //TODO: Other tests...
})
