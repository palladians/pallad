import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
//import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import { keyAgentStore } from '@palladxyz/vault'
import Client from 'mina-signer'
import { expect, test } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

import {
  MinaWalletDependencies,
  MinaWalletImpl,
  MinaWalletProps
} from '../src/Wallet'
const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const archiveUrl = 'https://devnet.graphql.minaexplorer.com'
describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let walletProperties: MinaWalletProps
  let network: Mina.Networks

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

  beforeEach(() => {
    walletDependencies = {
      keyAgent: keyAgentStore.getState().keyAgent
    }
    walletProperties = {
      network: Mina.Networks.MAINNET,
      name: 'Test Wallet',
      providers: {
        [Mina.Networks.MAINNET]: {
          provider: nodeUrl,
          archive: archiveUrl
        },
        [Mina.Networks.DEVNET]: {
          provider: 'https://proxy.devnet.minaexplorer.com/',
          archive: 'https://devnet.graphql.minaexplorer.com'
        },
        [Mina.Networks.BERKELEY]: {
          provider: 'https://proxy.berkeley.minaexplorer.com/',
          archive: 'https://berkeley.graphql.minaexplorer.com'
        }
      }
    }

    wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    network = Mina.Networks.MAINNET
  })
  test('wallet restores a wallet', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, restoreArgs, network, {
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
    await wallet.restoreWallet(payload, args, network, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // sign message
    const message: Mina.MessageBody = {
      message: 'Hello, Bob!'
    }
    const signedMessage = await wallet.sign(message)
    const minaClient = new Client({ network: args.networkType })
    const isVerified = await minaClient.verifyMessage(
      signedMessage as Mina.SignedMessage
    )
    expect(isVerified).toBeTruthy()
  })
  test('create wallet of strength 128', async () => {
    const wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    const mnemonicStrength = 128
    const walletMnemonic = await wallet.createWallet(mnemonicStrength)
    expect(walletMnemonic).toHaveProperty('mnemonic')
    expect(walletMnemonic?.mnemonic).toHaveLength(12)
  })
  test('create wallet of strength 256', async () => {
    const wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    const mnemonicStrength = 256
    const walletMnemonic = await wallet.createWallet(mnemonicStrength)
    expect(walletMnemonic).toHaveProperty('mnemonic')
    expect(walletMnemonic?.mnemonic).toHaveLength(24)
  })
  test('signs and verifies attestation signature', async () => {
    /*
    This is a draft test for some kind of attestation method
    See this example for a way to do attestation with snarkyjs: 
    https://github.com/teddyjfpender/awesome-snarkyjs-learnings/tree/master/starter-contracts/5-zk-program-credential-proof
    */
    // restore wallet
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const restorePayload = new MinaPayload()
    await wallet.restoreWallet(restorePayload, args, network, {
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
    const signedAttestation = await wallet.sign(attestationPayloadString)
    const minaClient = new Client({ network: args.networkType })
    const isVerified = await minaClient.verifyMessage(
      signedAttestation as Mina.SignedMessage
    )
    expect(isVerified).toBeTruthy()
  })
})
