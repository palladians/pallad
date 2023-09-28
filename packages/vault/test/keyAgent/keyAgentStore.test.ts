import {
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'

import { keyAgents } from '../../src/keyAgent/keyAgentState'
import { KeyAgentStore } from '../../src/keyAgent/keyAgentStore'

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('AccountStore', () => {
  let mnemonic: string[]
  let mnemonic2: string[]
  let agentArgs: FromBip39MnemonicWordsProps
  let agentArgs2: FromBip39MnemonicWordsProps
  let keyAgentName: string
  let keyAgentName2: string

  beforeEach(async () => {
    // Create keys for testing purposes
    mnemonic = [
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
    mnemonic2 = generateMnemonicWords()
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic
    }
    agentArgs2 = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic2
    }
    keyAgentName = 'test key agent'
    keyAgentName2 = 'test key agent 2'
  })

  afterEach(() => {
    // Cleanup after each test if needed
  })

  it('should create an keyAgent store', async () => {
    const keyAgentStore = new KeyAgentStore()
    expect(keyAgentStore).toBeDefined()
  })

  it('should initialize an InMemoryKeyAgent in the store', async () => {
    const keyAgentStore = new KeyAgentStore()
    await keyAgentStore.initialiseKeyAgent(
      keyAgentName,
      keyAgents.inMemory,
      agentArgs
    )
    const keyAgent = keyAgentStore.getKeyAgent(keyAgentName)
    expect(keyAgent.keyAgent).toBeDefined()
  })

  it('should add two InMemoryKeyAgents and remove one from store', async () => {
    const keyAgentStore = new KeyAgentStore()
    // add first key agent
    await keyAgentStore.initialiseKeyAgent(
      keyAgentName,
      keyAgents.inMemory,
      agentArgs
    )
    // add second key agent
    await keyAgentStore.initialiseKeyAgent(
      keyAgentName2,
      keyAgents.inMemory,
      agentArgs2
    )
    // check that both key agents are in the store
    const keyAgent1 = keyAgentStore.getKeyAgent(keyAgentName)
    const keyAgent2 = keyAgentStore.getKeyAgent(keyAgentName2)
    expect(keyAgent1.keyAgent).toBeDefined()
    expect(keyAgent2.keyAgent).toBeDefined()
    // remove first key agent
    keyAgentStore.removeKeyAgent(keyAgentName)
    // check that first key agent is removed
    const keyAgent1Removed = keyAgentStore.getKeyAgent(keyAgentName)
    expect(keyAgent1Removed.keyAgent).toBeUndefined()
  })

  it('should add two InMemoryKeyAgents and derive credentials for both at addresses index 0', async () => {
    const keyAgentStore = new KeyAgentStore()
    // add first key agent
    await keyAgentStore.initialiseKeyAgent(
      keyAgentName,
      keyAgents.inMemory,
      agentArgs
    )
    // add second key agent
    await keyAgentStore.initialiseKeyAgent(
      keyAgentName2,
      keyAgents.inMemory,
      agentArgs2
    )
    // check that both key agents are in the store
    const keyAgent1 = keyAgentStore.getKeyAgent(keyAgentName)
    const keyAgent2 = keyAgentStore.getKeyAgent(keyAgentName2)
    expect(keyAgent1.keyAgent).toBeDefined()
    expect(keyAgent2.keyAgent).toBeDefined()
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
    const derivedCredential = await keyAgent1.keyAgent?.deriveCredentials(
      payload,
      args,
      getPassphrase,
      false
    )
    expect(derivedCredential?.address).to.equal(
      expectedGroupedCredentials.address
    )
  })
})
