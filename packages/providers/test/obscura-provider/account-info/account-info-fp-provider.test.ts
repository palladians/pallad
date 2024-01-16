import { TokenIdMap } from '@palladxyz/mina-core'

import { createAccountInfoProvider } from '../../../src/obscura-provider'

const nodeUrl =
  process.env['OBSCURA_URL'] ||
  'http://alpha.mina-berkeley.obscura.build:3085/graphql'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qicdpMEVwzkDrf19uQiw6maKGDYV2C7DbnzhojF2dbVp4hWYhnNr'

describe('Obscura Account Info Provider (Functional)', () => {
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
      console.log('Obscura AccountInfo Provider Response', response)
      expect(response).toHaveProperty('MINA')
    })
  })

  //TODO: Other tests...
})
