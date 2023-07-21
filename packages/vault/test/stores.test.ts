import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management-agnostic'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

import { accountStore, keyAgentStore } from '../src/stores'

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('store', () => {
  let keyAgent: InMemoryKeyAgent
  let agentArgs: FromBip39MnemonicWordsProps
  let mnemonic: string[]
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
  })

  test('setAccountInfo', async () => {
    const accountInfo: AccountInfo = {
      balance: { total: 1000 },
      nonce: 1,
      inferredNonce: 1,
      delegate: 'delegate',
      publicKey: 'publicKey'
    }

    accountStore.getState().setAccountInfo(accountInfo)

    expect(accountStore.getState().accountInfo).toEqual(accountInfo)
  })

  test('setTransactions', async () => {
    const transactions: Mina.TransactionBody[] = [
      {
        type: 'payment',
        to: 'address1',
        from: 'address2',
        fee: '1',
        amount: '100',
        nonce: '1',
        memo: 'test memo',
        hash: 'hash1'
      }
    ]

    accountStore.getState().setTransactions(transactions)

    expect(accountStore.getState().transactions).toEqual(transactions)
  })

  test('restoreWallet', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await keyAgent.restoreKeyAgent(payload, restoreArgs, agentArgs)
    const rootPrivateKey = await keyAgent.exportRootPrivateKey()
    const encryptedSeedBytes = keyAgent.serializableData.encryptedSeedBytes

    await keyAgentStore
      .getState()
      .restoreWallet(payload, restoreArgs, agentArgs)
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
      .restoreWallet(payload, restoreArgs, agentArgs)

    const argsNewCredential: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 1,
      addressIndex: 0,
      networkType: 'testnet'
    }
    // derive next credentials
    await keyAgentStore
      .getState()
      .addCredentials(payload, argsNewCredential, false)
    // after adding credentials, the keyAgent should have the new credentials
    const storeKeyAgentCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    console.log('knownCredentials', storeKeyAgentCredentials)

    expect(storeKeyAgentCredentials).toHaveLength(2)
  })
})
