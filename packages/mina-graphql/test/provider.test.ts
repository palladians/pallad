import { AccountInfoArgs, TxStatusArgs } from '@palladxyz/mina-core'

import { MinaProvider } from '../src'

const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const nodeUrlMainnet = 'https://proxy.minaexplorer.com/graphql'

describe('Provider', () => {
  let provider: MinaProvider
  beforeEach(() => {
    provider = new MinaProvider(nodeUrl)
  })
  test('getAccountInfo', async () => {
    const args: AccountInfoArgs = {
      publicKey: 'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
    }

    const response = await provider.getAccountInfo(args)
    console.log('Response:', response)

    expect(response.balance).toBeDefined()
    expect(response.nonce).toBeDefined()
    expect(response.inferredNonce).toBeDefined()
    expect(response.delegate).toBeDefined()
    expect(response.publicKey).toBeDefined()
  })
  test('getAccountInfo (mainnet)', async () => {
    const args: AccountInfoArgs = {
      publicKey: 'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq' // this must be a public key that doesn't exist yet on mainnet
    }
    const mainnetProvider = new MinaProvider(nodeUrlMainnet)
    const response = await mainnetProvider.getAccountInfo(args)
    console.log('Response:', response)

    // expect the account to not exist yet
    expect(response.balance).toHaveProperty('total', 0)
    expect(response.nonce).toBe(0)
    expect(response.inferredNonce).toBe(0)
    expect(response.delegate).toBe('')
    expect(response.publicKey).toBe(args.publicKey)
  })
  test('getTransactionStatus', async () => {
    const args: TxStatusArgs = {
      ID: '3XpDTU4nx8aYjtRooxkf6eqLSVdzhEE4EEDQFTGkRYZZ9uRebxCTPYfC3731PKq5zK8nAqwQE7TUtGGveMGNhBhDrycFvnXEcWA6gtStmu4h9iiXG3CkFapgu9AZAKetNVjsx5ekVyRU8W5RHkBA9r5ntL36ddtodk9SCymkZ2qLhCGjpCaxuqih3kqWq3aVFwbNL5eQVrdgnYwZwuTTBdAVnYuqxkYKEKZuGGL12eZGBdnD1W9DMicXCkryzJx4dXJRas6ZrZGFEC8mTvtHZJ6ResVANXPfWuWKQu1xr8SPecfTuyKBC1VdeUqghpuHeznjTwdpNH6KBjvYkCzAuuaDrL8XgFHNC8Ka7bLBe9UXzemmtBxzQQs9uL3dZunhPudKn5aR42a4Z9rqtHC'
    }

    const response = await provider.getTransactionStatus(args)

    expect(response).toBeDefined()
  })
  // TODO: add test for submitTransaction
  // this should be done with a local network
})
