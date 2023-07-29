import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'

import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '../../key-management/dist'
import { keyAgentStore } from '../src/stores'

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)
const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const archiverUrl = 'https://devnet.graphql.minaexplorer.com'

describe('store', () => {
  let keyAgent: InMemoryKeyAgent
  let agentArgs: FromBip39MnemonicWordsProps
  let mnemonic: string[]
  let provider: MinaProvider
  let providerArchive: MinaArchiveProvider

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
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic,
      mnemonic2ndFactorPassphrase: ''
    }
    keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    provider = new MinaProvider(nodeUrl)
    providerArchive = new MinaArchiveProvider(archiverUrl)
  })
  test('restoreWallet', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await keyAgent.restoreKeyAgent(payload, restoreArgs)
    const rootPrivateKey = await keyAgent.exportRootPrivateKey()
    const encryptedSeedBytes = keyAgent.serializableData.encryptedSeedBytes

    await keyAgentStore
      .getState()
      .restoreWallet(payload, restoreArgs, provider, providerArchive, agentArgs)
    const storeRootPrivateKey = await keyAgentStore
      .getState()
      .keyAgent?.exportRootPrivateKey()
    const storeEncryptedSeedBytes =
      keyAgentStore.getState().keyAgent?.serializableData.encryptedSeedBytes
    expect(storeRootPrivateKey).toEqual(rootPrivateKey)
    // The encryptedSeedBytes should be different
    expect(storeEncryptedSeedBytes).not.toBe(encryptedSeedBytes)

    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const storeKeyAgentCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    console.log('knownCredentials', storeKeyAgentCredentials)
    expect(storeKeyAgentCredentials).toHaveLength(1)

    // check the store has account info
    const accountInformation = keyAgentStore
      .getState()
      .getAccountStore(storeKeyAgentCredentials[0]?.address)
    console.log('Account Information!')
    console.log('accountStore', accountInformation)
  })

  test('restoreWallet and second addCredentials', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    // restore the keyAgent
    await keyAgentStore
      .getState()
      .restoreWallet(payload, restoreArgs, provider, providerArchive, agentArgs)

    const argsNewCredential: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 1,
      addressIndex: 0,
      networkType: 'testnet'
    }
    // derive next credentials
    await keyAgentStore
      .getState()
      .addCredentials(
        payload,
        argsNewCredential,
        provider,
        providerArchive,
        false
      )
    // after adding credentials, the keyAgent should have the new credentials
    const storeKeyAgentCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    console.log('knownCredentials', storeKeyAgentCredentials)

    expect(storeKeyAgentCredentials).toHaveLength(2)
  })
})
