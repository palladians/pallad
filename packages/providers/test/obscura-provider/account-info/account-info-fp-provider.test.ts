import { createAccountInfoProvider } from '../../../src/obscura-provider'

const nodeUrl = process.env['OBSCURA_URL'] || ''
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'

describe('Obscura Account Info Provider (Functional)', () => {
  let provider: ReturnType<typeof createAccountInfoProvider>

  beforeEach(() => {
    provider = createAccountInfoProvider(nodeUrl)
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
      const response = await provider.getAccountInfo({ publicKey })
      console.log('Obscura AccountInfo Provider Response', response)
      expect(response).toHaveProperty('publicKey', publicKey)
    })
  })

  //TODO: Other tests...
})
