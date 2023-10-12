import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { InMemoryKeyAgent } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { KeyAgents } from '@palladxyz/vault'
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
  it('initializes the key agent correctly', async () => {
    const { result } = renderHook(() =>
      useWallet({ network: Mina.Networks.DEVNET, name: 'Pallad' })
    )
    const agentArgs = {
      mnemonicWords: PREMADE_MNEMONIC,
      getPassphrase: getPassword
    }
    let derivedCredential
    let keyAgentInitialised: InMemoryKeyAgent
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await act(async () => {
      keyAgentInitialised = await result.current.restoreWallet(
        payload,
        restoreArgs,
        Mina.Networks.DEVNET,
        agentArgs,
        keyAgentName
      )
      derivedCredential = result.current.currentWallet
    })
    expect(derivedCredential).toBeDefined()
    // them initialise the key agent store
    const keyAgentType = KeyAgents.InMemory

    await act(async () => {
      await result.current.initialiseKeyAgent(
        keyAgentName,
        keyAgentType,
        keyAgentInitialised
      )
      result.current.setCurrentKeyAgentName(keyAgentName)
    })
    expect(result.current.keyAgents[keyAgentName]).toBeDefined()
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
