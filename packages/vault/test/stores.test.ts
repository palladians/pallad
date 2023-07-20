import {
  FromBip39MnemonicWordsProps,
  GetPassphrase,
  InMemoryKeyAgent,
  Network
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

import { accountStore, keyAgentStore } from '../src/stores'
import { NetworkArgs } from '../src/vault'

describe('store', () => {
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
    const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
    const mnemonic = [
      'climb',
      'acquire',
      'robot',
      'select',
      'shaft',
      'zebra',
      'blush',
      'extend',
      'evolve',
      'host',
      'misery',
      'busy'
    ]
    const agentProps: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassword,
      mnemonicWords: mnemonic
    }
    const networkProps: NetworkArgs = {
      network: Network.Mina,
      networkType: 'testnet'
    }
    const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords(agentProps)
    const rootPrivateKey = await keyAgent.exportRootPrivateKey()
    const encryptedSeedBytes = keyAgent.serializableData.encryptedSeedBytes

    const storeKeyAgent = await keyAgentStore
      .getState()
      .restoreWallet(agentProps, networkProps)
    console.log('storeKeyAgent', storeKeyAgent)
    const storeRootPrivateKey = await keyAgentStore
      .getState()
      .keyAgent?.exportRootPrivateKey()
    const storeEncryptedSeedBytes = keyAgentStore.getState().keyAgent?.serializableData.encryptedSeedBytes
    expect(storeRootPrivateKey).toEqual(rootPrivateKey)
    // The encryptedSeedBytes should be different
    expect(storeEncryptedSeedBytes).not.toBe(encryptedSeedBytes)

    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const storeKeyAgentCredentials = keyAgentStore.getState().keyAgent?.serializableData.knownCredentials
    console.log('knownCredentials', storeKeyAgentCredentials)
    expect(storeKeyAgentCredentials).toHaveLength(1)
  })

  test('addCredentials', async () => {
    const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
    const mnemonic = [
      'climb',
      'acquire',
      'robot',
      'select',
      'shaft',
      'zebra',
      'blush',
      'extend',
      'evolve',
      'host',
      'misery',
      'busy'
    ]
    const agentProps: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassword,
      mnemonicWords: mnemonic
    }
    const networkProps: NetworkArgs = {
      network: Network.Mina,
      networkType: 'testnet'
    }
    await keyAgentStore.getState().restoreWallet(agentProps, networkProps)

    const credentialsData = {
      account_ix: 1,
      address_ix: 0,
      network: Network.Mina,
      networkType: 'testnet' as Mina.NetworkType,
      pure: true
    }
    // derive next credentials
    const credentials = await keyAgentStore
      .getState()
      .addCredentials(credentialsData)
    console.log('credentials', credentials)
    // after adding credentials, the keyAgent should have the new credentials
    const storeKeyAgentCredentials = keyAgentStore.getState().keyAgent?.serializableData.knownCredentials
    console.log('knownCredentials', storeKeyAgentCredentials)

    expect(storeKeyAgentCredentials).toHaveLength(2)
  })
})
