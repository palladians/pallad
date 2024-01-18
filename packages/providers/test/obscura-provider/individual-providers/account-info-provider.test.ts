import { TokenIdMap } from '@palladxyz/mina-core'

import { Obscura } from '../../../src/'

const nodeUrl =
  process.env['OBSCURA_URL'] ||
  'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

describe('Obscura Account Info Provider (Functional)', () => {
  let provider: ReturnType<typeof Obscura.createAccountInfoProvider>
  let tokenMap: TokenIdMap

  beforeEach(() => {
    provider = Obscura.createAccountInfoProvider(nodeUrl)
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
