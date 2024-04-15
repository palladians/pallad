import { TokenIdMap } from '@palladxyz/mina-core'

import { createAccountInfoProvider, ProviderConfig } from '../../../src'

const minaExplorerUrl =
  process.env['NODE_URL'] || 'https://proxy.berkeley.minaexplorer.com/'
const obscuraUrl =
  process.env['OBSCURA_URL'] ||
  'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

describe('Unified Account Info Provider (Functional)', () => {
  let provider: ReturnType<typeof createAccountInfoProvider>
  let tokenMap: TokenIdMap
  let configMinaExplorer: ProviderConfig
  let configObscura: ProviderConfig

  beforeEach(() => {
    tokenMap = {
      MINA: '1'
    }
  })

  describe.skip('Mina Explorer Configuration', () => {
    beforeEach(() => {
      configMinaExplorer = {
        nodeEndpoint: {
          providerName: 'mina-node',
          url: minaExplorerUrl
        },
        networkName: 'berkeley',
        chainId: '...'
      }
      provider = createAccountInfoProvider(configMinaExplorer)
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
        expect(response).toHaveProperty('MINA')
      })
    })
  })

  describe('Obscura Configuration', () => {
    beforeEach(() => {
      configObscura = {
        nodeEndpoint: {
          providerName: 'obscura',
          url: obscuraUrl
        },
        networkName: 'berkeley',
        chainId: '...'
      }

      provider = createAccountInfoProvider(configObscura)
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
        console.log('Obscura AccountInfo Provider Response', response)
        expect(response).toHaveProperty('MINA')
      })
    })

    //TODO: Other tests...
  })
})
