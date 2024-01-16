import { TokenIdMap } from '@palladxyz/mina-core'

import { createAccountInfoProvider } from '../../../src/mina-explorer/account-info/account-info-provider'

const nodeUrl =
  process.env['NODE_URL'] || 'https://proxy.berkeley.minaexplorer.com/'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'

describe('Mina Explorer Account Info Provider (Functional)', () => {
  let provider: ReturnType<typeof createAccountInfoProvider>
  let tokenMap: TokenIdMap

  beforeEach(() => {
    provider = createAccountInfoProvider(nodeUrl)
    tokenMap = {
      MINA: '1'
    }
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response).toHaveProperty('ok')
    })
  })

  describe('getAccountInfo', () => {
    it('should return account info for a valid public key', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.getAccountInfo({ publicKey, tokenMap })
      console.log('Mina Explorer AccountInfo Provider Response', response)
      expect(response).toHaveProperty('MINA')
    })
  })

  //TODO: Other tests...
})
