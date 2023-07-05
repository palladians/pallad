import { AccountInfo, Mina } from '@palladxyz/mina-core'

import { useStore } from '../src/stores'

describe('store', () => {
  test('setAccountInfo', async () => {
    const accountInfo: AccountInfo = {
      balance: { total: 1000 },
      nonce: 1,
      inferredNonce: 1,
      delegate: 'delegate',
      publicKey: 'publicKey'
    }

    useStore.getState().setAccountInfo(accountInfo)

    expect(useStore.getState().accountInfo).toEqual(accountInfo)
  })

  test('setTransactions', async () => {
    const transactions: Mina.TransactionBody[] = [
      {
        type: 'payment',
        to: 'address1',
        from: 'address2',
        fee: '1',
        amount: '100',
        nonce: '1',
        memo: 'test memo',
        hash: 'hash1'
        // Include other required properties
      }
      // Add more transactions if needed
    ]

    useStore.getState().setTransactions(transactions)

    expect(useStore.getState().transactions).toEqual(transactions)
  })
})
