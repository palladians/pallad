import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { act, renderHook } from '@testing-library/react'
import { expect } from 'vitest'

import { initialSingleAccountState } from '../../src'
import { useVault } from '../../src'

describe('AccountStore', () => {
  let address: string
  let network: string
  let mockAccountInfo: Record<string, AccountInfo>
  let mockTransactions: Record<string, Mina.TransactionBody[]>

  beforeEach(async () => {
    address = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    network = 'berkeley'
    mockAccountInfo = {
      MINA: {
        balance: {
          total: 49000000000
        },
        delegate: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        inferredNonce: 0,
        nonce: 0,
        publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      }
    }
    mockTransactions = {
      MINA: [
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
      ]
    }
  })

  afterEach(() => {
    const { result } = renderHook(() => useVault())
    act(() => result.current.clear())
  })

  it('should create a new accountStore', async () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.accounts).toEqual({})
  })

  it('should create a new accountStore with initial state', async () => {
    let finalAccountInfo
    const { result } = renderHook(() => useVault())
    const accountInfo = mockAccountInfo
    act(() => {
      // adding an ensureAccount call here to ensure the account is created
      // this fixes `TypeError: Cannot read properties of undefined`
      result.current.ensureAccount(network, address)
      result.current.setAccountInfo(network, address, accountInfo)
      finalAccountInfo = result.current.getAccountInfo(
        network,
        address
      ).accountInfo
    })
    console.log('finalAccountInfo', finalAccountInfo)
    expect(finalAccountInfo).toEqual(accountInfo)
  })

  it('should set and get transactions', async () => {
    let finalTransactions
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setTransactions(network, address, mockTransactions)
      finalTransactions = result.current.getTransactions(
        network,
        address,
        'MINA'
      )
    })
    expect(finalTransactions).toEqual(mockTransactions['MINA'])
  })

  it('should add an account', () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.addAccount(
        network,
        'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e'
      )
    })
    expect(
      result.current.getAccountInfo(
        network,
        'B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e'
      )
    ).toEqual(initialSingleAccountState)
  })

  it('should remove an account', () => {
    let finalAccountInfo
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.addAccount(network, address)
      result.current.setAccountInfo(network, address, mockAccountInfo)
      result.current.removeAccount(network, address)
      finalAccountInfo = result.current.getAccountInfo(network, address)
    })
    expect(finalAccountInfo).toEqual(initialSingleAccountState)
  })
})
