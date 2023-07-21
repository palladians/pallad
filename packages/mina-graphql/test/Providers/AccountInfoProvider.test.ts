import { AccountInfoArgs } from '@palladxyz/mina-core'

import { AccountInfoGraphQLProvider } from '../../src/Providers/AccountInfo/AccountInfoProvider'

const minaExplorerGql = 'https://proxy.devnet.minaexplorer.com/'

describe('AccountInfoGraphQLProvider', () => {
  test('getAccountInfo', async () => {
    const args: AccountInfoArgs = {
      publicKey: 'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
    }

    const provider = new AccountInfoGraphQLProvider(minaExplorerGql)
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
