import {
  FromBip39MnemonicWordsProps,
  GetPassphrase,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

import { accountStore, keyAgentStore } from '../src/stores'

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
    const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords(agentProps)

    const storeKeyAgent = await keyAgentStore.getState().restoreWallet({ mnemonic, getPassword })
    console.log('storeKeyAgent', storeKeyAgent)
    console.log('keyAgent', keyAgent) 
    expect(keyAgentStore.getState().keyAgent?.serializableData.encryptedSeedBytes).toEqual(keyAgent.serializableData.encryptedSeedBytes)
  })

  /*test('addCredentials', async () => {

    const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords(agentProps)
    keyAgentStore.getState().keyAgent = keyAgent

    const credentialsData = {
      account_ix: 1,
      address_ix: 1,
      network: 'test network',
      networkType: 'test network type',
      pure: true
    }

    await keyAgentStore.getState().addCredentials(credentialsData)
  })*/
})
