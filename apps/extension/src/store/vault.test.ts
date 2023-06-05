import { renderHook, act } from '@testing-library/react'
import { useVaultStore } from './vault'
import { beforeEach, expect } from 'vitest'

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
    expect(result.current.currentWalletPubKey).toEqual(null)
  })

  it('adds new credential', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({ walletPubKey: 'pubkey', walletPrivateKey: 'privkey', walletName: 'Test Wallet' })
    })
    expect(result.current.credentials.length).toEqual(1)
  })

  it('sets existing wallet', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({ walletPubKey: 'pubkey', walletPrivateKey: 'privkey', walletName: 'Test Wallet' })
      result.current.setCurrentWalletPubKey({ currentWalletPubKey: 'pubkey' })
    })
    expect(result.current.currentWalletPubKey).toEqual('pubkey')
  })

  it('fails to set existing wallet', () => {
    const { result } = renderHook(() => useVaultStore())
    try {
      act(() => {
        result.current.setCurrentWalletPubKey({ currentWalletPubKey: 'pubkey_not_existing' })
      })
    } catch (error: any) {
      expect(error.message).toContain('credential does not exist')
    }
  })

  it('returns current wallet', () => {
    const { result } = renderHook(() => useVaultStore())
    act(() => {
      result.current.addCredential({ walletPubKey: 'pubkey', walletPrivateKey: 'privkey', walletName: 'Test Wallet' })
      result.current.setCurrentWalletPubKey({ currentWalletPubKey: 'pubkey' })
    })
    expect(result.current.getCurrentWallet()?.walletPrivateKey).toEqual('privkey')
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
    const mnemonic = 'habit hope tip crystal because grunt nation idea electric witness alert like'
    const { result } = renderHook(() => useVaultStore())
    await act(async () => {
      const wallet = await result.current.restoreWallet({ walletName, mnemonic })
      expect(wallet.publicKey).toEqual('B62qnHVdf5V7JTiRJDZMXrLNxdcH3xGamp5fUs6uMo5TuwMGHdt1dW2')
    })
    expect(result.current.credentials.length).toEqual(1)
    expect(result.current.getCurrentWallet()?.walletName).toEqual(walletName)
  })
})
