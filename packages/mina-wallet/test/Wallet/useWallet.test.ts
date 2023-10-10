import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, renderHook } from '@testing-library/react'

import { useWallet } from '../../src'

const PREMADE_MNEMONIC = [
  'habit',
  'hope',
  'tip',
  'crystal',
  'because',
  'grunt',
  'nation',
  'idea',
  'electric',
  'witness',
  'alert',
  'like'
]
const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
const keyAgentName = 'test agent'

describe('useWallet', () => {
  it('initializes', () => {
    const { result } = renderHook(() =>
      useWallet({ network: Mina.Networks.DEVNET, name: 'Pallad' })
    )
    expect(result.current.walletName).toEqual('Pallad')
    expect(result.current.walletNetwork).toEqual(Mina.Networks.DEVNET)
  })
  it('creates a wallet of strength 128', async () => {
    let mnemonic: string[] = []
    const { result } = renderHook(() =>
      useWallet({ network: Mina.Networks.DEVNET, name: 'Pallad' })
    )
    await act(async () => {
      mnemonic = (await result.current.createWallet(128)).mnemonic
    })
    expect(mnemonic).toHaveLength(12)
  })
  it('creates a wallet of strength 256', async () => {
    let mnemonic: string[] = []
    const { result } = renderHook(() =>
      useWallet({ network: Mina.Networks.DEVNET, name: 'Pallad' })
    )
    await act(async () => {
      mnemonic = (await result.current.createWallet(256)).mnemonic
    })
    expect(mnemonic).toHaveLength(24)
  })
  it('restores a wallet', async () => {
    const { result } = renderHook(() =>
      useWallet({ network: Mina.Networks.DEVNET, name: 'Pallad' })
    )
    let derivedCredential
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await act(async () => {
      await result.current.restoreWallet(
        payload,
        restoreArgs,
        Mina.Networks.DEVNET,
        {
          mnemonicWords: PREMADE_MNEMONIC,
          getPassphrase: getPassword
        },
        keyAgentName
      )
      derivedCredential = result.current.currentWallet
    })
    expect(derivedCredential).toBeDefined()
  })
})
