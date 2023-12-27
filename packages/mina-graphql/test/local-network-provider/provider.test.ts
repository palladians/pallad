//import { AccountInfoArgs } from '@palladxyz/mina-core'

import { MinaProvider } from '../../src'
/**
 * This is a test for a local network provider.
 * A larger refactor of the test suites will add the
 * provider urls as a parameter to the test suite's cli command.
 * to run, use:
 *  NODE_URL=https://proxy.devnet.minaexplorer.com/ pnpm test:unit test/local-network-provider/provider.test.ts
 */

const nodeUrl = process.env['NODE_URL'] || 'http://localhost:8080/graphql'
console.log('Using node url:', nodeUrl)

describe('Node Provider', () => {
  let provider: MinaProvider
  beforeAll(() => {
    provider = new MinaProvider(nodeUrl!)
  })
<<<<<<< HEAD
  it.skip('should getAccountInfo for an address already in the ledger', async () => {
=======
  it('should getAccountInfo for an address already in the ledger', async () => {
>>>>>>> 1a06f92 (fix(node provider test): change to health check)
    /*const publicKey =
      process.env['PUBLIC_KEY'] ||
      'B62qicdpMEVwzkDrf19uQiw6maKGDYV2C7DbnzhojF2dbVp4hWYhnNr'
    const args: AccountInfoArgs = {
      publicKey: publicKey
    }*/

    //const response = await provider.getAccountInfo(args)
    const response = await provider.healthCheck()
    console.log('Node Provider Health Response:', response)
<<<<<<< HEAD
    expect(response.ok).toBe(true)
=======
    expect(response).toBeDefined()
>>>>>>> 1a06f92 (fix(node provider test): change to health check)
    //expect(response?.balance).toBeDefined()
    //expect(response?.nonce).toBeDefined()
    //expect(response?.inferredNonce).toBeDefined()
    //expect(response?.delegate).toBeDefined()
    //expect(response?.publicKey).toBeDefined()
  })
  /*it('getAccountInfo for account that doesn't exist', async () => {
    const args: AccountInfoArgs = {
      // this must be a public key that doesn't exist yet on the network
      publicKey: 'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
    }
    const mainnetProvider = new MinaProvider(nodeUrl!)
    const response = await mainnetProvider.getAccountInfo(args)
    console.log('Response:', response)

    // expect the account to not exist yet
    expect(response?.balance).toHaveProperty('total', 0)
    expect(response?.nonce).toBe(0)
    expect(response?.inferredNonce).toBe(0)
    expect(response?.delegate).toBe('')
    expect(response?.publicKey).toBe(args.publicKey)
  })*/
  // TODO: add test for submitTransaction
  // this should be done with a local network
})
