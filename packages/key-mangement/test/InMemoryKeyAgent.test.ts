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
import { KeyConst } from '../src/types'
import * as bip39 from '../src/util/bip39'
import { deriveCoinTypePrivateKey } from '../src/util/key'

// Create a sandbox for managing and restoring stubs
const sandbox = sinon.createSandbox()

// Create keys for testing purposes
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
] //bip39.generateMnemonicWords(strength)
const seed = bip39.mnemonicToSeed(mnemonic, '')
// Create root node from seed
const root = bip32.HDKey.fromMasterSeed(seed)
// unencrypted root key bytes
const rootKeyBytes = root.privateKey ? root.privateKey : Buffer.from([])

// Derive a child key from the given derivation path
const purposeKey = root.deriveChild(KeyConst.PURPOSE)
const coinTypeKey = purposeKey.deriveChild(KeyConst.MINA_COIN_TYPE)
const coinTypeKeyBytes = coinTypeKey.privateKey
  ? coinTypeKey.privateKey
  : Buffer.from([])

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)
const passphrase = await getPassphraseRethrowTypedError(getPassphrase)
const encryptedRootPrivateKey = await emip3encrypt(rootKeyBytes, passphrase)

const coinTypePrivateKeyBytes = await deriveCoinTypePrivateKey({
  rootPrivateKey: rootKeyBytes
})
const encryptedCoinTypePrivateKey = await emip3encrypt(
  coinTypePrivateKeyBytes,
  passphrase
)

console.log('encryptedRootPrivateKey: ', encryptedRootPrivateKey)
console.log('encryptedCoinTypePrivateKeyBytes: ', encryptedCoinTypePrivateKey)
console.log('coinTypeKeyBytes: ', coinTypeKeyBytes)
console.log('rootKeyBytes: ', rootKeyBytes)

describe('InMemoryKeyAgent', () => {
  let agentProps: InMemoryKeyAgentProps
  let agent: InMemoryKeyAgent

  beforeEach(() => {
    // Prepare agent properties
    agentProps = {
      getPassphrase,
      encryptedRootPrivateKeyBytes: encryptedRootPrivateKey,
      encryptedCoinTypePrivateKeyBytes: encryptedCoinTypePrivateKey,
      knownCredentials: []
      //decryptCoinTypePrivateKey: agent.decryptCoinTypePrivateKey,
      //decryptRootPrivateKey: agent.decryptRootPrivateKey,
    }

    // Create new agent
    agent = new InMemoryKeyAgent(agentProps)
    //console.log('agent: ', agent)
  })

  afterEach(() => {
    // Restore all stubs after each test
    sandbox.restore()
  })

  /*
 it('should create an agent with given properties', async () => {
    expect(agent).to.be.instanceOf(InMemoryKeyAgent)
  })
  it('should export root private key', async () => {
    const result = await agent.exportRootPrivateKey()
    expect(result).to.deep.equal(rootKeyBytes)
  })

  it('should throw error when export root private key fails', async () => {
    const errorMessage = 'Failed to export root private key'
    agentProps.decryptRootPrivateKey = sinon
      .stub()
      .throws(new Error(errorMessage))
    try {
      await agent.exportRootPrivateKey()
    } catch (error) {
      expect(error.message).to.equal(errorMessage)
    }
  })*/
  describe('fromBip39MnemonicWords', () => {
    it('should return an instance of InMemoryKeyAgent', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })
      console.log('agentFromBip39: ', agentFromBip39)

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
    it('should create an instance of InMemoryKeyAgent and decrypt the root private key', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })
      expect(agentFromBip39).to.be.instanceOf(InMemoryKeyAgent)

      const result = await agent.decryptRootPrivateKey()
      expect(result).to.deep.equal(rootKeyBytes)
    })
    it('should create an instance of InMemoryKeyAgent and decrypt the coin type private key', async () => {
      const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase,
        mnemonicWords: mnemonic
      })
      expect(agentFromBip39).to.be.instanceOf(InMemoryKeyAgent)

      const result = await agent.decryptCoinTypePrivateKey()
      expect(result).to.deep.equal(coinTypeKeyBytes)
    })
  })
  /*
  it('should decrypt root private key', async () => {
    const result = await agent.decryptRootPrivateKey()
    console.log("encrypted root", agent.serializableData.encryptedRootPrivateKeyBytes.toString('hex'))
    console.log("decrypted root", result.toString('hex'))
    console.log("rootKeyBytes", rootKeyBytes.toString('hex'))
    expect(result).to.deep.equal(rootKeyBytes)
  })

  it('should throw error when decrypting root private key fails', async () => {
    const errorMessage = 'Failed to decrypt root private key'
    agentProps.decryptRootPrivateKey = sinon
      .stub()
      .throws(new Error(errorMessage))
    try {
      await agent.decryptRootPrivateKey()
    } catch (error) {
      expect(error.message).to.equal(errorMessage)
    }
  })*/

  /*it('should decrypt coin type private key', async () => {
    const result = await agent.decryptCoinTypePrivateKey()
    console.log("encrypted CoinType", agent.serializableData.encryptedCoinTypePrivateKeyBytes.toString('hex'))
    console.log("decrypted CoinType", result.toString('hex'))
    console.log("coinTypeKeyBytes", coinTypeKeyBytes.toString('hex'))
    expect(result).to.deep.equal(coinTypeKeyBytes)
  })
  

  it('should throw error when decrypting coin type private key fails', async () => {
    const errorMessage = 'Failed to decrypt coin type private key';
    agentProps.decryptCoinTypePrivateKey = sinon.stub().throws(new Error(errorMessage));
    try {
      await agent.decryptCoinTypePrivateKey();
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }
  */
})
//});
