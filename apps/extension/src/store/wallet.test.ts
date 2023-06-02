import { renderHook, act } from '@testing-library/react-hooks'
import { useWalletStore } from './wallet'
import { expect } from 'vitest'

it('initializes the store', () => {
  const { result } = renderHook(() => useWalletStore())
  expect(result.current.credentials).toEqual([])
  expect(result.current.currentWalletPubKey).toEqual(null)
})

it('adds new credential', () => {
  const { result } = renderHook(() => useWalletStore())
  act(() => {
    result.current.addCredential({ walletPubKey: 'pubkey', walletPrivateKey: 'privkey', walletName: 'Test Wallet' })
  })
  expect(result.current.credentials.length).toEqual(1)
})

it('sets existing wallet', () => {
  const { result } = renderHook(() => useWalletStore())
  act(() => {
    result.current.addCredential({ walletPubKey: 'pubkey', walletPrivateKey: 'privkey', walletName: 'Test Wallet' })
    result.current.setCurrentWalletPubKey('pubkey')
  })
  expect(result.current.currentWalletPubKey).toEqual('pubkey')
})

it('fails to set existing wallet', () => {
  const { result } = renderHook(() => useWalletStore())
  act(() => {
    try {
      result.current.setCurrentWalletPubKey(null)
      result.current.setCurrentWalletPubKey('pubkey_not_existing')
    } catch {
      expect(result.current.currentWalletPubKey).toEqual(null)
    }
  })
})
