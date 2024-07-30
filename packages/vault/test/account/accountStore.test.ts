import { type AccountInfo, Mina } from "@palladxyz/mina-core"
import { act, renderHook } from "@testing-library/react"
import { expect } from "vitest"

import { initialSingleAccountState } from "../../src"
import { useVault } from "../../src"

describe("AccountStore", () => {
  let address: string
  let network: string
  let mockAccountInfo: Record<string, AccountInfo>
  let mockTransactions: Record<string, Mina.TransactionBody[]>

  beforeEach(() => {
    address = "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"
    network = "devnet"
    mockAccountInfo = {
      MINA: {
        balance: {
          total: 49000000000,
        },
        delegate: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        inferredNonce: 0,
        nonce: 0,
        publicKey: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
      },
    }
    mockTransactions = {
      MINA: [
        {
          amount: 50000000000,
          blockHeight: 204824,
          dateTime: "2023-06-26T09:12:00Z",
          failureReason: "null",
          fee: 10000000,
          from: "B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e",
          hash: "CkpZwt2TjukbsTkGi72vB2acPtZsNFF8shMm4A9cR1eaRQFWfMwUJ",
          isDelegation: false,
          to: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
          token: "1",
          type: Mina.TransactionType.PAYMENT,
          nonce: 0,
        },
      ],
    }
  })

  afterEach(() => {
    const { result } = renderHook(() => useVault())
    act(() => result.current.clear())
  })

  it("should create a new accountStore", () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.accounts).toEqual({})
  })

  it("should create a new accountStore with initial state", () => {
    let finalAccountInfo
    const { result } = renderHook(() => useVault())
    const accountInfo = mockAccountInfo
    act(() => {
      // adding an ensureAccount call here to ensure the account is created
      // this fixes `TypeError: Cannot read properties of undefined`
      result.current.ensureAccount(network, address)
      result.current.setAccountInfo(network, address, accountInfo)
      finalAccountInfo = result.current.getAccountsInfo(
        network,
        address,
      ).accountInfo
    })
    expect(finalAccountInfo).toEqual(accountInfo)
  })

  it("should set and get transactions", () => {
    let finalTransactions
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setTransactions(network, address, mockTransactions)
      finalTransactions = result.current.getTransactions(
        network,
        address,
        "MINA",
      )
    })
    expect(finalTransactions).toEqual(mockTransactions.MINA)
  })

  it("should add an account", () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.addAccount(
        network,
        "B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e",
      )
    })
    expect(
      result.current.getAccountsInfo(
        network,
        "B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e",
      ),
    ).toEqual(initialSingleAccountState)
  })

  it("should remove an account", () => {
    let finalAccountInfo
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.addAccount(network, address)
      result.current.setAccountInfo(network, address, mockAccountInfo)
      result.current.removeAccount(network, address)
      finalAccountInfo = result.current.getAccountsInfo(network, address)
    })
    expect(finalAccountInfo).toEqual(initialSingleAccountState)
  })

  it("should handle setting account info when account already exists", () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.ensureAccount(network, address)
      result.current.setAccountInfo(network, address, mockAccountInfo)
      result.current.setAccountInfo(network, address, {
        MINA: { ...mockAccountInfo.MINA, balance: { total: 300 } },
      })
    })
    const accountInfo = result.current.getAccountInfo(network, address, "MINA")
    expect(accountInfo.balance.total).toBe(300)
  })

  it("should get undefined for non-existing account info and transaction", () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      const accountInfo = result.current.getAccountInfo(
        network,
        address,
        "NON_EXISTENT",
      )
      const transaction = result.current.getTransaction(
        network,
        address,
        "nonExistingHash",
        "MINA",
      )
      expect(accountInfo.balance.total).toBe(0)
      expect(transaction).toBeUndefined()
    })
  })

  it("should update transactions properly", () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.ensureAccount(network, address)
      result.current.setTransactions(network, address, mockTransactions)
      result.current.setTransactions(network, address, {
        MINA: [
          ...mockTransactions.MINA,
          { ...mockTransactions.MINA[0], amount: 1000 },
        ],
      })
    })
    const transactions = result.current.getTransactions(
      network,
      address,
      "MINA",
    )
    expect(transactions.length).toBe(2)
    expect(transactions[1].amount).toBe(1000)
  })

  it.skip("should clear all accounts correctly", () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.addAccount(network, address)
      result.current.clear()
    })
    const accountInfo = result.current.getAccountsInfo(network, address)
    expect(accountInfo).toEqual(initialSingleAccountState)
  })
})
