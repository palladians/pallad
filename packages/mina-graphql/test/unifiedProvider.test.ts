import { AccountInfoArgs, TxStatusArgs } from '@palladxyz/mina-core'
import {
  Transaction,
  TransactionId,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs,
  UnifiedMinaProviderConfig
} from '@palladxyz/mina-core'

import { UnifiedMinaProvider } from '../src'

const nodeUrl =
  process.env['NODE_URL'] || 'https://proxy.devnet.minaexplorer.com/'
const archiveUrl =
  process.env['ARCHIVE_NODE_URL'] || 'https://devnet.graphql.minaexplorer.com'
const address =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
const txHash =
  process.env['TX_HASH'] ||
  'CkpZwt2TjukbsTkGi72vB2acPtZsNFF8shMm4A9cR1eaRQFWfMwUJ'
const txId =
  process.env['TX_ID'] ||
  '3XpDTU4nx8aYjtRooxkf6eqLSVdzhEE4EEDQFTGkRYZZ9uRebxCTPYfC3731PKq5zK8nAqwQE7TUtGGveMGNhBhDrycFvnXEcWA6gtStmu4h9iiXG3CkFapgu9AZAKetNVjsx5ekVyRU8W5RHkBA9r5ntL36ddtodk9SCymkZ2qLhCGjpCaxuqih3kqWq3aVFwbNL5eQVrdgnYwZwuTTBdAVnYuqxkYKEKZuGGL12eZGBdnD1W9DMicXCkryzJx4dXJRas6ZrZGFEC8mTvtHZJ6ResVANXPfWuWKQu1xr8SPecfTuyKBC1VdeUqghpuHeznjTwdpNH6KBjvYkCzAuuaDrL8XgFHNC8Ka7bLBe9UXzemmtBxzQQs9uL3dZunhPudKn5aR42a4Z9rqtHC'
const transaction: Transaction = {
  amount: 50000000000,
  blockHeight: 204824,
  dateTime: '2023-06-26T09:12:00Z',
  failureReason: null,
  fee: 10000000,
  from: 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e',
  hash: 'CkpZwt2TjukbsTkGi72vB2acPtZsNFF8shMm4A9cR1eaRQFWfMwUJ',
  id: '3XpDTU4nx8aYjtRooxkf6eqLSVdzhEE4EEDQFTGkRYZZ9uRebxCTPYfC3731PKq5zK8nAqwQE7TUtGGveMGNhBhDrycFvnXEcWA6gtStmu4h9iiXG3CkFapgu9AZAKetNVjsx5ekVyRU8W5RHkBA9r5ntL36ddtodk9SCymkZ2qLhCGjpCaxuqih3kqWq3aVFwbNL5eQVrdgnYwZwuTTBdAVnYuqxkYKEKZuGGL12eZGBdnD1W9DMicXCkryzJx4dXJRas6ZrZGFEC8mTvtHZJ6ResVANXPfWuWKQu1xr8SPecfTuyKBC1VdeUqghpuHeznjTwdpNH6KBjvYkCzAuuaDrL8XgFHNC8Ka7bLBe9UXzemmtBxzQQs9uL3dZunhPudKn5aR42a4Z9rqtHC',
  isDelegation: false,
  kind: 'PAYMENT',
  memo: 'E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH',
  nonce: 2016,
  to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
  token: 1
}
const expectedTransaction = process.env['TRANSACTION'] || transaction
console.log('Using archive node url:', nodeUrl)

describe('Provider', () => {
  let provider: UnifiedMinaProvider
  beforeEach(() => {
    const providerConfig: UnifiedMinaProviderConfig = {
      nodeUrl,
      archiveUrl
    }
    provider = new UnifiedMinaProvider(providerConfig)
  })
  test('getAccountInfo', async () => {
    const args: AccountInfoArgs = {
      publicKey: address
    }

    const response = await provider.getAccountInfo(args)
    console.log('Response:', response)

    expect(response.balance).toBeDefined()
    expect(response.nonce).toBeDefined()
    expect(response.inferredNonce).toBeDefined()
    expect(response.delegate).toBeDefined()
    expect(response.publicKey).toBeDefined()
  })
  test('getTransactionStatus', async () => {
    const args: TxStatusArgs = {
      ID: txId
    }

    const response = await provider.getTransactionStatus(args)

    expect(response).toBeDefined()
  })
  test('getTransactions', async () => {
    const args: TransactionsByAddressesArgs = {
      addresses: [address],
      pagination: { startAt: 0, limit: 10 }
    }

    const response = await provider.getTransactions(args)

    expect(response.pageResults.length).toBeGreaterThan(0)

    const transaction = response.pageResults[0]

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
  test('getTransaction', async () => {
    const args: TransactionsByIdsArgs = {
      ids: [txHash as TransactionId]
    }
    const response = await provider.getTransaction(args)

    expect(response.length).toBeGreaterThan(0)
    expect(response[0]).toEqual(expectedTransaction)
  })
})
