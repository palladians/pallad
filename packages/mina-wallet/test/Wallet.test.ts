import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management-agnostic'
import { Mina } from '@palladxyz/mina-core'
//import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  MinaProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import { accountStore, keyAgentStore } from '@palladxyz/vault'
import Client from 'mina-signer'
import { expect, test } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

import { MinaWalletDependencies, MinaWalletImpl } from '../src/Wallet'
const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const explorerUrl = 'https://devnet.graphql.minaexplorer.com'
describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let provider: MinaProvider



  const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
  const mnemonic = [
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

  const minaAddresses = [
    'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
    'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'
  ]

  beforeEach(() => {
    provider = new MinaProvider(nodeUrl, explorerUrl)

    walletDependencies = {
      keyAgent: keyAgentStore.getState().keyAgent,
      minaProvider: provider,
    }
    wallet = new MinaWalletImpl({ name: 'Test Wallet' }, walletDependencies)
  })
  test('wallet restores a wallet', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, restoreArgs, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const storeKeyAgentCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    console.log('knownCredentials', storeKeyAgentCredentials)
    expect(storeKeyAgentCredentials).toHaveLength(1)
    console.log('Derived Credentials:', storeKeyAgentCredentials)
  })
  test('restores wallet and signs message', async () => {
    // restore wallet
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, args, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // sign message
    const message: Mina.MessageBody = {
      message: 'Hello, Bob!'
    }
    const signedMessage = await wallet.sign(payload, message, args)
    const minaClient = new Client({ network: args.networkType })
    const isVerified = await minaClient.verifyMessage(
      signedMessage as Mina.SignedMessage
    )
    expect(isVerified).toBeTruthy()
  })
  test('signs and verifies attestation signature', async () => {
    /*
    This is a draft test for some kind of attestation method
    */
    // restore wallet
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const restorePayload = new MinaPayload()
    await wallet.restoreWallet(restorePayload, args, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // get derived credentials
    const derivedCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    if (derivedCredentials === undefined) {
      throw new Error('Derived credentials are undefined')
    }
    // attestation payload
    const attestationPayload = {
      context: derivedCredentials[0]['@context'],
      type: 'Attestation',
      issuer: derivedCredentials[0].id,
      issuanceDate: new Date().toISOString(),
      credentialSubject: derivedCredentials[0]
    }

    // convert the attestationPayload object to a string
    const attestationPayloadString: Mina.MessageBody = {
      message: JSON.stringify(attestationPayload)
    }

    // sign attestation
    const signedAttestation = await wallet.sign(
      restorePayload,
      attestationPayloadString,
      args
    )
    const minaClient = new Client({ network: args.networkType })
    const isVerified = await minaClient.verifyMessage(
      signedAttestation as Mina.SignedMessage
    )
    expect(isVerified).toBeTruthy()
  })
})
