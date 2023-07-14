import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import sinon from 'sinon'
import { expect } from 'vitest'

import { emip3encrypt } from '../src/emip3'
import * as errors from '../src/errors'
import {
  getPassphraseRethrowTypedError,
  InMemoryKeyAgent,
  InMemoryKeyAgentProps
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
  let agentProps: InMemoryKeyAgentProps
  let agent: InMemoryKeyAgent
  let passphrase: Uint8Array
  let encryptedSeedBytes: Uint8Array
  let rootKeyBytes: Uint8Array
  let mnemonic: string[]
  let seed: Uint8Array
  let root: bip32.HDKey
  let networkType: Mina.NetworkType
  let network: Network

  beforeEach(async () => {
    // Create keys for testing purposes
    mnemonic = [
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
    ] //bip39.generateMnemonicWords(strength)
    seed = bip39.mnemonicToSeed(mnemonic, '')
    // Create root node from seed
    root = bip32.HDKey.fromMasterSeed(seed)
    // Derive a child key from the given derivation path
    //purposeKey = root.deriveChild(KeyConst.PURPOSE)
    //coinTypeKey = purposeKey.deriveChild(KeyConst.MINA_COIN_TYPE)
    // unencrypted root key bytes
    rootKeyBytes = root.privateKey ? root.privateKey : Buffer.from([])
    // define the agent properties
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    encryptedSeedBytes = await emip3encrypt(seed, passphrase)

    // Prepare agent properties
    agentProps = {
      getPassphrase,
      encryptedSeedBytes: encryptedSeedBytes,
      knownCredentials: []
    }

    // Create new agent
    agent = new InMemoryKeyAgent(agentProps)

    // network
    network = Network.Mina
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
  describe('fromBip39MnemonicWords', () => {
    it('should return an instance of InMemoryKeyAgent', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })
      expect(agentFromBip39).to.be.instanceOf(InMemoryKeyAgent)
    })
    it('should throw error when invalid mnemonic is provided', async () => {
      const invalidMnemonic = [...mnemonic]
      invalidMnemonic[0] = 'invalid_word'
      try {
        await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase,
          mnemonicWords: invalidMnemonic
        })
      } catch (error) {
        expect(error).to.be.instanceOf(errors.InvalidMnemonicError)
      }
    })

    it('should throw error when getPassphrase fails', async () => {
      try {
        await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase: sinon.stub().throws(new Error()),
          mnemonicWords: mnemonic
        })
      } catch (error) {
        expect(error).to.be.instanceOf(errors.AuthenticationError)
      }
    })
    it('should create an instance of InMemoryKeyAgent and check if the encrypted root private key is not equal to the decrypted private key', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })
      expect(agentFromBip39).to.be.instanceOf(InMemoryKeyAgent)
      const decryptedSeedBytes = await agentFromBip39.decryptSeed()
      const rootKey = bip32.HDKey.fromMasterSeed(decryptedSeedBytes)
      // check the encrypted seed bytes are not equal to the seed
      expect(encryptedSeedBytes).to.not.equal(seed)
      expect(rootKey.privateKey).to.deep.equal(rootKeyBytes)
    })
    it('should create an instance of InMemoryKeyAgent and decrypt the root private key', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })
      expect(agentFromBip39).to.be.instanceOf(InMemoryKeyAgent)

      const result = await agent.exportRootPrivateKey()
      expect(result).to.deep.equal(rootKeyBytes)
    })
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
    it('should create an agent that can derive credentials', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })

      const mockedPublicKey: Mina.PublicKey =
        'B62qn2bkAtVmN6dptpYtU5i9gnq4SwDakFDo7Je7Fp8Tc8TtXnPxfVv'
      const stubDerivePublicKey = sinon.stub(agentFromBip39, 'derivePublicKey')
      stubDerivePublicKey.resolves(mockedPublicKey)

      const expectedGroupedCredentials = {
        chain: Network.Mina,
        accountIndex: 1,
        address: mockedPublicKey,
        addressIndex: 0
      }

      const groupedCredentials = await agentFromBip39.deriveCredentials(
        { account_ix: 1 },
        { address_ix: 0 },
        network,
        networkType,
        true
      )
      expect(groupedCredentials).to.deep.equal(expectedGroupedCredentials)
      sinon.assert.calledOnce(stubDerivePublicKey)
    })
  })
})
