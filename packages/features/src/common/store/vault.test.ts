import { Network } from '@palladxyz/key-generator'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, expect } from 'vitest'

import { useVaultStore } from './vault'

const credential = {
  walletPublicKey: 'pubkey',
  walletPrivateKey: 'privkey',
  walletName: 'Test Wallet'
}

let result: any
let resetVault: void | (() => void)

describe('VaultStore', () => {
  beforeEach(() => {
    result = renderHook(() => useVaultStore()).result
    resetVault = () => {
      act(() => {
        result.current.reset()
      })
    }
    resetVault()
  })

  const addCredential = () => {
    act(() => {
      result.current.addCredential(credential)
    })
  }

  it('initializes the store', () => {
    expect(result.current.credentials).toEqual([])
    expect(result.current.currentWalletPublicKey).toEqual(null)
  })

  it('adds new credential', () => {
    addCredential()
    expect(result.current.credentials.length).toEqual(1)
  })

  it('returns accounts', () => {
    addCredential()
    expect(result.current.getAccounts()).toEqual([credential.walletPublicKey])
  })

  it('sets existing wallet', () => {
    addCredential()
    act(() => {
      result.current.setCurrentWalletPublicKey({
        currentWalletPublicKey: credential.walletPublicKey
      })
    })
    expect(result.current.currentWalletPublicKey).toEqual(
      credential.walletPublicKey
    )
  })

  it('fails to set existing wallet', () => {
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
    addCredential()
    act(() => {
      result.current.setCurrentWalletPublicKey({
        currentWalletPublicKey: credential.walletPublicKey
      })
    })
    expect(result.current.getCurrentWallet()?.walletPublicKey).toEqual(
      credential.walletPublicKey
    )
  })

  const performWalletTests = async (walletName: string, network: Network) => {
    const accountNumber = 0
    resetVault()
    await act(async () => {
      const wallet = await result.current.createWallet({
        walletName,
        network,
        accountNumber
      })
      expect(wallet.mnemonic.length).gt(0)
    })
    expect(result.current.credentials.length).toEqual(1)
    expect(result.current.getCurrentWallet()?.walletName).toEqual(walletName)
  }

  it('creates a new wallet for Mina networks', async () => {
    await performWalletTests('TestWallet', Network.Mina)
  })

  it('restores wallet for Mina networks', async () => {
    const walletName = 'NiceWallet'
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const network = Network.Mina
    const accountNumber = 0

    resetVault()

    await act(async () => {
      const wallet = await result.current.restoreWallet({
        walletName,
        mnemonic,
        network,
        accountNumber
      })
      expect(wallet.publicKey).toEqual(
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      )
    })
    expect(result.current.credentials.length).toEqual(1)
    expect(result.current.getCurrentWallet()?.walletName).toEqual(walletName)
  })

  it('creates a new wallet for EVM networks', async () => {
    await performWalletTests('TestWalletEVM', Network.Ethereum)
  })

  it('restores wallet for EVM networks', async () => {
    const walletName = 'NiceWalletEVM'
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const network = Network.Ethereum
    const accountNumber = 0

    resetVault()

    await act(async () => {
      const wallet = await result.current.restoreWallet({
        walletName,
        mnemonic,
        network,
        accountNumber
      })
      expect(wallet.publicKey).toEqual(
        '0x81467312d5447223eac5e3e5611476a50c42d810c84b4e2e20350c903c6806d46ee3f0283e74c5cbcf5d0ba5d0ce332ef866b1065f5887b0bf46d1cf737dd79e'
      )
    })
    expect(result.current.credentials.length).toEqual(1)
    expect(result.current.getCurrentWallet()?.walletName).toEqual(walletName)
  })
})
