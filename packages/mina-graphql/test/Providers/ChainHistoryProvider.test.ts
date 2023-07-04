import {
  Transaction,
  TransactionId,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { ChainHistoryGraphQLProvider } from '../../src/Providers/ChainHistory/ChainHistoryProvider'
// TO DO: create end-to-end suite with a local-network
const minaExplorerGql = 'https://berkeley.graphql.minaexplorer.com'

describe('ChainHistoryGraphQLProvider', () => {
  test('healthCheck', async () => {
    const provider = new ChainHistoryGraphQLProvider(minaExplorerGql)
    const response = await provider.healthCheck()

    expect(response).toEqual({ ok: true })
  })

  test('transactionsByAddresses', async () => {
    const args: TransactionsByAddressesArgs = {
      addresses: ['B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'],
      pagination: { startAt: 0, limit: 10 }
    }

    const provider = new ChainHistoryGraphQLProvider(minaExplorerGql)
    const response = await provider.transactionsByAddresses(args)
    // note: this response is not ordered

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

  test('transactionsByHashes', async () => {
    const args: TransactionsByIdsArgs = {
      ids: [
        '5JuWCbvWt6nXKJgbU5RyECSkxfdAL2azbsoTWP9sxqBD2e7HEaY6' as TransactionId
      ]
    }

    const provider = new ChainHistoryGraphQLProvider(minaExplorerGql)
    const response = await provider.transactionsByHashes(args)

    expect(response.length).toBeGreaterThan(0)
    const expectedTransaction: Transaction = {
      amount: 5000000000,
      blockHeight: 21098,
      dateTime: '2023-07-01T12:00:01Z',
      failureReason: null,
      fee: 500000000,
      from: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      hash: '5JuWCbvWt6nXKJgbU5RyECSkxfdAL2azbsoTWP9sxqBD2e7HEaY6',
      id: 'Av0AZc0dKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIAAP//IgENSGVsbG8sIFdvcmxkIQAAAAAAAAAAAAAAAAAAAAAAAAAAKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIAKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIA/ADyBSoBAAAAKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIAjQsRbcG5Caa7IvxJ2a3LAlHRBeMxL/299Y3yLZQ3WBbsrSPG14AB4bExXHfsg7/BAQod6r84b3MoFNfgRE7gDQ==',
      isDelegation: false,
      kind: 'PAYMENT',
      memo: 'E4YnrV1abo1sNxEd9hEeWymcX5hSXt3cNL3E9JcFbv1CtdtdKG2JP',
      nonce: 0,
      to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      token: 'wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf'
    }
    expect(response[0]).toEqual(expectedTransaction)
  })
})
