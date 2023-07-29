import {
  Transaction,
  TransactionId,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { MinaArchiveProvider } from '../src'

const archiveUrl = 'https://devnet.graphql.minaexplorer.com'

describe('Provider', () => {
  let providerArchive: MinaArchiveProvider
  beforeEach(() => {
    providerArchive = new MinaArchiveProvider(archiveUrl)
    
  })
  test('getTransactions', async () => {
    const args: TransactionsByAddressesArgs = {
      addresses: ['B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'],
      pagination: { startAt: 0, limit: 10 }
    }

    const response = await providerArchive.getTransactions(args)

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
      ids: [
        'CkpZwt2TjukbsTkGi72vB2acPtZsNFF8shMm4A9cR1eaRQFWfMwUJ' as TransactionId
      ]
    }
    const response = await providerArchive.getTransaction(args)

    expect(response.length).toBeGreaterThan(0)
    const expectedTransaction: Transaction = {
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
    expect(response[0]).toEqual(expectedTransaction)
  })
})
