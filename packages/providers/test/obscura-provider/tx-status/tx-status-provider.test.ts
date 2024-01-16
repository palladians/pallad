import { TxStatus } from '@palladxyz/mina-core'

import { createTransactionStatusProvider } from '../../../src/obscura-provider'

const nodeUrl =
  process.env['OBSCURA_URL'] ||
  'http://alpha.mina-berkeley.obscura.build:3085/graphql'
const txId =
  process.env['TX_ID'] ||
  'Av0AwusL/+cWVFkjyBFPR9rFNHta+V8q8vHbYTQ3gMyHKyXkcjQACwD//yIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/nFlRZI8gRT0faxTR7WvlfKvLx22E0N4DMhysl5HI0APyAGeuEAAAAAP/nFlRZI8gRT0faxTR7WvlfKvLx22E0N4DMhysl5HI0AIDa/ybX+NBM+IrPyZXk1uTQzqHlzzlbmr1PufF0wAQKDq/ia0vONmdHjndfjXK6Gur0JeSbVaMoxBDS9bm2iQw='

describe('Obscura Transaction Status Provider (Functional)', () => {
  let provider: ReturnType<typeof createTransactionStatusProvider>

  beforeEach(() => {
    provider = createTransactionStatusProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response).toHaveProperty('ok')
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
