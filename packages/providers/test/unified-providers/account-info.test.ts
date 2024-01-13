import {
  UnifiedAccountInfoProvider,
  UnifiedAccountInfoProviderConfig
} from '../../src/unified-providers/account-info'

const obscura_url = process.env['OBSCURA_URL'] || ''
const mina_explorer_url = process.env['MINA_EXPLORER_URL'] || ''
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'

describe('Unified Account Info Provider', () => {
  let provider: UnifiedAccountInfoProvider
  let config: UnifiedAccountInfoProviderConfig

  describe('Obscura', () => {
    beforeEach(() => {
      config = {
        providerName: 'obscura',
        networkName: 'berkeley',
        url: obscura_url,
        chainId: 'abc'
      }
      provider = new UnifiedAccountInfoProvider(config)
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
  })

  describe('Mina Explorer', () => {
    beforeEach(() => {
      config = {
        providerName: 'mina-explorer',
        networkName: 'berkeley',
        url: mina_explorer_url,
        chainId: 'abc'
      }
      provider = new UnifiedAccountInfoProvider(config)
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
  })

  //TODO: Other tests...
})
