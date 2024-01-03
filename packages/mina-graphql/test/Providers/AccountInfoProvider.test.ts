import { AccountInfoArgs } from '@palladxyz/mina-core'

import { AccountInfoGraphQLProvider } from '../../src/Providers/AccountInfo/AccountInfoProvider'

const nodeUrl =
  process.env['NODE_URL'] || 'https://proxy.devnet.minaexplorer.com/'
const address =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
console.log('Using node url:', nodeUrl)

describe('AccountInfoGraphQLProvider', () => {
  test('getAccountInfo', async () => {
    const args: AccountInfoArgs = {
      publicKey: address
    }

    const provider = new AccountInfoGraphQLProvider(nodeUrl)
    const health = await provider.healthCheck()
    console.log('Health check:', health)
    if (!health) {
      throw new Error('Health check failed')
    }
    const response = await provider.getAccountInfo(args)
    console.log('Response:', response)

    expect(response.balance).toBeDefined()
    expect(response.nonce).toBeDefined()
    expect(response.inferredNonce).toBeDefined()
    expect(response.delegate).toBeDefined()
    expect(response.publicKey).toBeDefined()
  })
})
