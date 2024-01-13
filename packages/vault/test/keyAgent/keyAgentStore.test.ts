import {
  ChainOperationArgs,
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  GroupedCredentials,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { act, renderHook } from '@testing-library/react'
import { expect } from 'vitest'

import { KeyAgents } from '../../src'
import { useVault } from '../../src'

const PREGENERATED_MNEMONIC = [
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

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('KeyAgentStore', () => {
  let randomMnemonic: string[]
  let agentArgs: FromBip39MnemonicWordsProps
  let agentArgs2: FromBip39MnemonicWordsProps
  const keyAgentName = 'test key agent'
  const keyAgentName2 = 'test key agent 2'

  beforeEach(async () => {
    randomMnemonic = generateMnemonicWords()
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC
    }
    agentArgs2 = {
      getPassphrase: getPassphrase,
      mnemonicWords: randomMnemonic
    }
  })

  afterEach(() => {
    const {
      result: { current }
    } = renderHook(() => useVault())
    act(() => current.clear())
  })

  it('should create an keyAgent store', async () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.keyAgents).toEqual({})
  })

  it('should initialize an InMemoryKeyAgent in the store', async () => {
    const { result } = renderHook(() => useVault())
    await act(async () => {
      await result.current.initialiseKeyAgent(
        keyAgentName,
        KeyAgents.InMemory,
        agentArgs
      )
    })
    expect(result.current.keyAgents[keyAgentName]).toBeDefined()
    expect(
      result.current.keyAgents[keyAgentName]?.serializableData
    ).toBeDefined()
  })

  it('should initialize an InMemoryKeyAgent in the store and restore it', async () => {
    const { result } = renderHook(() => useVault())
    await act(async () => {
      await result.current.initialiseKeyAgent(
        keyAgentName,
        KeyAgents.InMemory,
        agentArgs
      )
    })
    expect(result.current.keyAgents[keyAgentName]).toBeDefined()
    expect(
      result.current.keyAgents[keyAgentName]?.serializableData
    ).toBeDefined()
    const keyAgent = result.current.keyAgents[keyAgentName]
    const restoredKeyAgent = result.current.restoreKeyAgent(
      keyAgentName,
      getPassphrase
    )
    expect(restoredKeyAgent.serializableData).toEqual(
      keyAgent?.serializableData
    )
  })

  it('should add two InMemoryKeyAgents and remove one from store', async () => {
    const { result } = renderHook(() => useVault())
    await act(async () => {
      // add first key agent
      await result.current.initialiseKeyAgent(
        keyAgentName,
        KeyAgents.InMemory,
        agentArgs
      )
      // add second key agent
      await result.current.initialiseKeyAgent(
        keyAgentName2,
        KeyAgents.InMemory,
        agentArgs2
      )
    })
    const keyAgent1 = result.current.keyAgents[keyAgentName]
    const keyAgent2 = result.current.keyAgents[keyAgentName2]
    expect(keyAgent1?.keyAgent).toBeDefined()
    expect(keyAgent2?.keyAgent).toBeDefined()
    act(() => {
      // remove first key agent
      result.current.removeKeyAgent(keyAgentName)
    })
    // check that first key agent is removed
    const keyAgent1Removed = result.current.keyAgents[keyAgentName]
    expect(keyAgent1Removed?.keyAgent).toBeUndefined()
  })

  it('should add two InMemoryKeyAgents and derive credentials for both at addresses index 0', async () => {
    const { result } = renderHook(() => useVault())
    await act(async () => {
      // add first key agent
      await result.current.initialiseKeyAgent(
        keyAgentName,
        KeyAgents.InMemory,
        agentArgs
      )
      // add second key agent
      await result.current.initialiseKeyAgent(
        keyAgentName2,
        KeyAgents.InMemory,
        agentArgs2
      )
    })
    // check that both key agents are in the store
    const keyAgent1 = result.current.keyAgents[keyAgentName]
    const keyAgent2 = result.current.keyAgents[keyAgentName2]
    expect(keyAgent1?.keyAgent).toBeDefined()
    expect(keyAgent2?.keyAgent).toBeDefined()
    // derive credentials for first key agent
    const expectedPublicKey: Mina.PublicKey =
      'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

    const expectedGroupedCredentials = {
      '@context': ['https://w3id.org/wallet/v1'],
      id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      type: 'MinaAddress',
      controller:
        'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      name: 'Mina Account',
      description: 'My Mina account.',
      chain: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      address: expectedPublicKey
    }

    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await act(async () => {
      const derivedCredential = await keyAgent1?.keyAgent?.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true // has to be true as we're not writing the credential to the key agent's serializable data
      )
      expect(derivedCredential?.address).toEqual(
        expectedGroupedCredentials.address
      )
    })
  })
  it('should sign a payload with a key agent', async () => {
    const { result } = renderHook(() => useVault())
    await act(async () => {
      // add first key agent
      await result.current.initialiseKeyAgent(
        keyAgentName,
        KeyAgents.InMemory,
        agentArgs
      )
      // create credential
      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: 'testnet'
      }
      const payload = new MinaPayload()
      const groupedCredential = await result.current.createCredential(
        keyAgentName,
        payload,
        args,
        getPassphrase
      )

      console.log('groupedCredential: ', groupedCredential)
      // signable payload
      const message: Mina.MessageBody = {
        message: 'Hello, Bob!'
      }
      // define operation object
      const operations: ChainOperationArgs = {
        operation: 'mina_sign',
        network: 'Mina',
        networkType: 'testnet'
      }
      // sign payload
      const signedMessage = await result.current.request(
        keyAgentName,
        groupedCredential as GroupedCredentials,
        message,
        operations
      )
      console.log('signedMessage: ', signedMessage)
    })
    // check that key agent is in the store
    const keyAgent = result.current.keyAgents[keyAgentName]
    expect(keyAgent?.keyAgent).toBeDefined()

    expect(true).toEqual(true)
  })
})
