import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { expect } from 'vitest'

import { initialSingleAccountState } from '../../src/account/accountState'
import { AccountStore, accountStore } from '../../src/account/accountStore'

describe('AccountStore', () => {
  let address: string
  let network: Mina.Networks
  let mockAccountInfo: AccountInfo
  let mockTransactions: Mina.Paginated<Mina.TransactionBody>
  let newAccountStore: typeof accountStore

  beforeEach(async () => {
    address = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    network = Mina.Networks.DEVNET
    mockAccountInfo = {
      balance: {
        total: 49000000000
      },
      delegate: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      inferredNonce: 0,
      nonce: 0,
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    }
    mockTransactions = {
      pageResults: [
        {
          amount: 50000000000,
          blockHeight: 204824,
          dateTime: '2023-06-26T09:12:00Z',
          failureReason: 'null',
          fee: 10000000,
          from: 'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e',
          hash: 'CkpZwt2TjukbsTkGi72vB2acPtZsNFF8shMm4A9cR1eaRQFWfMwUJ',
          isDelegation: false,
          kind: Mina.TransactionKind.PAYMENT,
          to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
          token: '1',
          type: Mina.TransactionKind.PAYMENT,
          nonce: 0
        }
      ],
      totalResultCount: 1
    }

    newAccountStore = accountStore
  })

  afterEach(() => {
    // Cleanup after each test if needed
  })

  it('should create a new accountStore', async () => {
    expect(newAccountStore).toBeDefined()
  })

  it('should create a new accountStore with initial state', async () => {
    const accountInfo = mockAccountInfo
    accountStore.getState().setAccountInfo(network, address, accountInfo)
    expect(
      accountStore.getState().getAccountInfo(network, address).accountInfo
    ).toEqual(accountInfo)
  })
  /*
    Add more tests for accountStore
  */

  it('should create an account store', async () => {
    const accountStore = new AccountStore()
    expect(accountStore).toBeDefined()
  })

  it('should set account info', async () => {
    const accountStore = new AccountStore()
    const accountInfo = mockAccountInfo
    accountStore.setAccountInfo(network, address, accountInfo)
    expect(accountStore.getAccountInfo(network, address).accountInfo).toEqual(
      accountInfo
    )
  })

  it('should set and get transactions', async () => {
    const accountStore = new AccountStore()
    const transactions = mockTransactions
    accountStore.setTransactions(network, address, transactions.pageResults)
    expect(accountStore.getTransactions(network, address)).toEqual(
      transactions.pageResults
    )
  })

  it('should add an account', () => {
    const accountStore = new AccountStore()
    accountStore.addAccount(network, address)
    expect(accountStore.getAccountInfo(network, address)).toEqual(
      initialSingleAccountState
    )
  })

  it('should remove an account', () => {
    const accountStore = new AccountStore()
    accountStore.addAccount(network, address)
    const accountInfo = mockAccountInfo
    accountStore.setAccountInfo(network, address, accountInfo)
    accountStore.removeAccount(network, address)
    expect(accountStore.getAccountInfo(network, address)).toEqual(
      initialSingleAccountState
    )
  })
})
