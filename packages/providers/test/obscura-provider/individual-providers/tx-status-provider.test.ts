import { TxStatus } from '@palladxyz/mina-core'

import { Obscura } from '../../../src'

const nodeUrl =
  process.env['OBSCURA_URL'] ||
  'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
const txId =
  process.env['TX_ID'] ||
  'Av0AwusL/+cWVFkjyBFPR9rFNHta+V8q8vHbYTQ3gMyHKyXkcjQACwD//yIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/nFlRZI8gRT0faxTR7WvlfKvLx22E0N4DMhysl5HI0APyAGeuEAAAAAP/nFlRZI8gRT0faxTR7WvlfKvLx22E0N4DMhysl5HI0AIDa/ybX+NBM+IrPyZXk1uTQzqHlzzlbmr1PufF0wAQKDq/ia0vONmdHjndfjXK6Gur0JeSbVaMoxBDS9bm2iQw='

describe('Obscura Transaction Status Provider (Functional)', () => {
  let provider: ReturnType<typeof Obscura.createTransactionStatusProvider>

  beforeEach(() => {
    provider = Obscura.createTransactionStatusProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe('checkTxStatus', () => {
    it('should return the status of a transaction', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.checkTxStatus({ ID: txId })
      console.log('Obscura Tx Status Provider Response', response)
      // TODO: Check why the query always returns "UNKNOWN"
      expect(response).toBe(TxStatus.UNKNOWN)
    })
  })

  //TODO: Other tests...
})
