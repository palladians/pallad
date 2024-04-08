import * as bip32 from '@scure/bip32'
import sinon from 'sinon'
import { expect } from 'vitest'

import {
  EthereumPayload,
  EthereumSpecificArgs
} from '../../src/chains/Ethereum'
//import { emip3encrypt } from '../src/emip3'
import {
  FromBip39MnemonicWordsProps,
  //getPassphraseRethrowTypedError,
  InMemoryKeyAgent
} from '../../src/InMemoryKeyAgent'
import { Network } from '../../src/types'
import * as bip39 from '../../src/util/bip39'

// Create a sandbox for managing and restoring stubs
const sandbox = sinon.createSandbox()

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))

describe('InMemoryKeyAgent', () => {
  let agent: InMemoryKeyAgent
  let rootKeyBytes: Uint8Array
  let mnemonic: string[]
  let seed: Uint8Array
  let root: bip32.HDKey

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
  })

  afterEach(() => {
    // Restore all stubs after each test
    sandbox.restore()
  })

  it('should create an agent with given properties', () => {
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
    it('should restore an agent that has Ethereum credentials at initialisation', async () => {
      const expectedPublicKey = '0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9'

      const expectedGroupedCredentials = {
        '@context': ['https://w3id.org/wallet/v1'],
        id: 'did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9',
        type: 'EthereumAddress',
        controller: 'did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9',
        name: 'Ethereum Account',
        description: 'My Ethereum account.',
        chain: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0,
        address: expectedPublicKey
      }

      const args: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }

      const payload = new EthereumPayload()

      await agent.restoreKeyAgent(payload, args, getPassphrase)
      expect(agent).to.be.instanceOf(InMemoryKeyAgent)
      expect(
        agent.serializableData.credentialSubject.contents[0]?.address
      ).to.deep.equal(expectedGroupedCredentials.address)

      //await agent.deriveCredentials(ethPayload, ethArgs, getPassphrase, false)
      //expect(
      //  agent.serializableData.credentialSubject.contents[1]?.address
      //).to.deep.equal(expectedEthGroupedCredentials.address)
    })
  })
})
