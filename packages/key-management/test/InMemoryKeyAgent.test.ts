import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import sinon from 'sinon'
import { expect } from 'vitest'

import { EthereumPayload, EthereumSpecificArgs } from '../src/chains/Ethereum'
import { MinaPayload, MinaSpecificArgs } from '../src/chains/Mina'
//import { emip3encrypt } from '../src/emip3'
import {
  FromBip39MnemonicWordsProps,
  //getPassphraseRethrowTypedError,
  InMemoryKeyAgent
} from '../src/InMemoryKeyAgent'
import { Network } from '../src/types'
import * as bip39 from '../src/util/bip39'

// Create a sandbox for managing and restoring stubs
const sandbox = sinon.createSandbox()

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('InMemoryKeyAgent', () => {
  let agent: InMemoryKeyAgent
  let rootKeyBytes: Uint8Array
  let mnemonic: string[]
  let seed: Uint8Array
  let root: bip32.HDKey
  let networkType: Mina.NetworkType

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
    //bip39.generateMnemonicWords(strength)
    seed = bip39.mnemonicToSeed(mnemonic, '')
    // Create root node from seed
    root = bip32.HDKey.fromMasterSeed(seed)
    // unencrypted root key bytes
    rootKeyBytes = root.privateKey ? root.privateKey : Buffer.from([])
    // define the agent properties
    //encryptedSeedBytes = await emip3encrypt(seed, passphrase)
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic,
      mnemonic2ndFactorPassphrase: ''
    }
    agent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    // network type
    networkType = 'testnet'
  })

  afterEach(() => {
    // Restore all stubs after each test
    sandbox.restore()
  })

  it('should create an agent with given properties', async () => {
    expect(agent).to.be.instanceOf(InMemoryKeyAgent)
  })
  it('should export root private key', async () => {
    const result = await agent.exportRootPrivateKey()
    expect(result).to.deep.equal(rootKeyBytes)
  })
  describe('Restore InMemory KeyAgent', () => {
    /*
    // Need to fix this test
    it('should throw error when decrypting root private key fails', async () => {
        const fakeGetPassphrase = async () => Buffer.from('wrong_passphrase');
        const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase: fakeGetPassphrase,
          mnemonicWords: mnemonic
        });
        await expect(agentFromBip39.decryptSeed()).rejects.toThrow('Failed to decrypt root private key');
      });
      it('should throw error when decrypting coin type private key fails', async () => {
        const fakeGetPassphrase = async () => Buffer.from('wrong_passphrase');
        const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase: fakeGetPassphrase,
          mnemonicWords: mnemonic
        });
        await expect(agentFromBip39.decryptCoinTypePrivateKey()).rejects.toThrow('Failed to decrypt coin type private key');
      });*/
    it('should restore an agent that has Mina credentials at initialisation', async () => {
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
        networkType: networkType
      }
      const payload = new MinaPayload()

      await agent.restoreKeyAgent(payload, args, getPassphrase)
      expect(agent).to.be.instanceOf(InMemoryKeyAgent)
      expect(
        agent.serializableData.credentialSubject.contents[0]?.address
      ).to.deep.equal(expectedGroupedCredentials.address)
    })
    it('should restore an agent that has Mina credentials at initialisation and derives Ethereum credentials', async () => {
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
        networkType: networkType
      }
      const payload = new MinaPayload()

      await agent.restoreKeyAgent(payload, args, getPassphrase)
      expect(agent).to.be.instanceOf(InMemoryKeyAgent)
      expect(
        agent.serializableData.credentialSubject.contents[0]?.address
      ).to.deep.equal(expectedGroupedCredentials.address)

      // Define a mocked publicKey, which should be expected from the derivation
      const expectedEthPublicAddress =
        '0xa98005e6ce8e62adf8f9020fa99888e8f107e3c9'
      const expectedEthGroupedCredentials = {
        '@context': ['https://w3id.org/wallet/v1'],
        id: 'did:ethr:0xa98005e6ce8e62adf8f9020fa99888e8f107e3c9',
        type: 'EthereumAddress',
        controller: 'did:ethr:0xa98005e6ce8e62adf8f9020fa99888e8f107e3c9',
        name: 'Ethereum Account',
        description: 'My Ethereum account.',
        chain: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0,
        address: expectedEthPublicAddress
      }

      const ethArgs: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }
      const ethPayload = new EthereumPayload()

      await agent.deriveCredentials(ethPayload, ethArgs, getPassphrase, false)
      expect(
        agent.serializableData.credentialSubject.contents[1]?.address
      ).to.deep.equal(expectedEthGroupedCredentials.address)
    })
  })
})
