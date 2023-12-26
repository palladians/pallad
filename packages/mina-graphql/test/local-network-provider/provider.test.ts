import { AccountInfoArgs } from '@palladxyz/mina-core'

import { MinaProvider } from '../../src'
/**
 * This is a test for a local network provider.
 * A larger refactor of the test suites will add the
 * provider urls as a parameter to the test suite's cli command.
 */

const nodeUrl = process.env['NODE_URL'] || 'http://localhost:8080/graphql'
console.log('Using node url:', nodeUrl)

describe('Node Provider', () => {
  let provider: MinaProvider
  beforeAll(() => {
    provider = new MinaProvider(nodeUrl!)
  })
  test('getAccountInfo', async () => {
    const publicKey =
      process.env['PUBLIC_KEY'] ||
      'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
    const args: AccountInfoArgs = {
      publicKey: publicKey
    }

    const response = await provider.getAccountInfo(args)
    console.log('Account Provider Response:', response)

    expect(response?.balance).toBeDefined()
    expect(response?.nonce).toBeDefined()
    expect(response?.inferredNonce).toBeDefined()
    expect(response?.delegate).toBeDefined()
    expect(response?.publicKey).toBeDefined()
  })
  test.skip('getAccountInfo (mainnet)', async () => {
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
  })
  // TODO: add test for submitTransaction
  // this should be done with a local network
})
