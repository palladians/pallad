import {
  FromBip39MnemonicWordsProps,
  generateMnemonicWords
} from '@palladxyz/key-management'

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
    keyAgentName2 = 'test key agent other'
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
})
