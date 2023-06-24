import { act, renderHook } from '@testing-library/react'
import { beforeEach, expect } from 'vitest'

import { useVaultStore } from './vault'

describe('VaultStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.reset()
    })
  })

  it('initializes the store', () => {
    const { result } = renderHook(() => useVaultStore())
    expect(result.current.credentials).toEqual([])
    expect(result.current.currentWalletPublicKey).toEqual(null)
  })

  it('adds new credential', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({
        walletPublicKey: 'pubkey',
        walletPrivateKey: 'privkey',
        walletName: 'Test Wallet'
      })
    })
    expect(result.current.credentials.length).toEqual(1)
  })

  it('returns accounts', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({
        walletPublicKey: 'pubkey',
        walletPrivateKey: 'privkey',
        walletName: 'Test Wallet'
      })
    })
    expect(result.current.getAccounts()).toEqual(['pubkey'])
  })

  it('sets existing wallet', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({
        walletPublicKey: 'pubkey',
        walletPrivateKey: 'privkey',
        walletName: 'Test Wallet'
      })
      result.current.setCurrentWalletPublicKey({
        currentWalletPublicKey: 'pubkey'
      })
    })
    expect(result.current.currentWalletPublicKey).toEqual('pubkey')
  })

  it('fails to set existing wallet', () => {
    const { result } = renderHook(() => useVaultStore())
    try {
      act(() => {
        result.current.setCurrentWalletPublicKey({
          currentWalletPublicKey: 'pubkey_not_existing'
        })
      })
    } catch (error: any) {
      expect(error.message).toContain('credential does not exist')
    }
  })

  it('returns current wallet', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({
        walletPublicKey: 'pubkey',
        walletPrivateKey: 'privkey',
        walletName: 'Test Wallet'
      })
      result.current.setCurrentWalletPublicKey({
        currentWalletPublicKey: 'pubkey'
      })
    })
    expect(result.current.getCurrentWallet()?.walletPublicKey).toEqual('pubkey')
  })

  it('creates a new wallet', async () => {
    const walletName = 'TestWallet'
    const { result } = renderHook(() => useVaultStore())
    await act(async () => {
      const { mnemonic } = await result.current.createWallet({ walletName })
      expect(mnemonic.length).gt(0)
    })
    expect(result.current.credentials.length).toEqual(1)
    expect(result.current.getCurrentWallet()?.walletName).toEqual(walletName)
  })

  it('restores wallet', async () => {
    const walletName = 'NiceWallet'
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const { result } = renderHook(() => useVaultStore())
    await act(async () => {
      const wallet = await result.current.restoreWallet({
        walletName,
        mnemonic
      })
      expect(wallet.publicKey).toEqual(
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      )
    })
    expect(result.current.credentials.length).toEqual(1)
    expect(result.current.getCurrentWallet()?.walletName).toEqual(walletName)
  })
})
