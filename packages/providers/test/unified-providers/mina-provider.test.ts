import { TokenIdMap } from '@palladxyz/mina-core'

import { createMinaProvider, ProviderConfig } from '../../src'

const minaExplorerUrl =
  process.env['NODE_URL'] || 'https://proxy.berkeley.minaexplorer.com/'
const minaExplorerArchiveUrl =
  process.env['ARCHIVE_URL'] || 'https://berkeley.graphql.minaexplorer.com'
const obscuraUrl =
  process.env['OBSCURA_URL'] ||
  'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'

describe('Mina Provider (Functional)', () => {
  let provider: ReturnType<typeof createMinaProvider>
  let tokenMap: TokenIdMap
  let configMinaExplorer: ProviderConfig
  let configObscura: ProviderConfig

  beforeEach(() => {
    tokenMap = {
      MINA: '1'
    }
  })

  describe('Mina Provider - Mina Explorer Configuration', () => {
    beforeEach(() => {
      configMinaExplorer = {
        nodeEndpoint: {
          providerName: 'mina-explorer',
          url: minaExplorerUrl
        },
        archiveNodeEndpoint: {
          providerName: 'mina-explorer',
          url: minaExplorerArchiveUrl
        },
        networkName: 'berkeley',
        chainId: '...'
      }
      provider = createMinaProvider(configMinaExplorer)
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
        console.log('Mina Explorer AccountInfo Provider Response', response)
        expect(response).toHaveProperty('MINA')
      })
    })

    describe('transactionsByAddresses', () => {
      it('should return transaction history for a valid public key', async () => {
        // This test now depends on the actual response from the server
        const response = await provider.getTransactions({
          addresses: [publicKey]
        })
        const transaction = response[0]

        expect(transaction).toHaveProperty('amount')
        expect(transaction).toHaveProperty('blockHeight')
        expect(transaction).toHaveProperty('dateTime')
        expect(transaction).toHaveProperty('failureReason')
        expect(transaction).toHaveProperty('fee')
        expect(transaction).toHaveProperty('from')
        expect(transaction).toHaveProperty('hash')
        expect(transaction).toHaveProperty('isDelegation')
        expect(transaction).toHaveProperty('kind')
        expect(transaction).toHaveProperty('to')
        expect(transaction).toHaveProperty('token')
      })
    })

    describe('getDaemonStatus', () => {
      it('should return daemon status', async () => {
        // This test now depends on the actual response from the server
        const response = await provider.getDaemonStatus()
        console.log('Mina Explorer DaemonStatus Provider Response', response)
        expect(response).toHaveProperty('daemonStatus')
      })
    })
  })

  describe('Obscura Configuration (Mixed with Mina Explorer for Chain History)', () => {
    beforeEach(() => {
      configObscura = {
        nodeEndpoint: {
          providerName: 'obscura',
          url: obscuraUrl
        },
        archiveNodeEndpoint: {
          providerName: 'mina-explorer',
          url: minaExplorerArchiveUrl
        },
        networkName: 'berkeley',
        chainId: '...'
      }

      provider = createMinaProvider(configObscura)
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
