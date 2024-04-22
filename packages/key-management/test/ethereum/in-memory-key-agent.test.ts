import { Network } from '@palladxyz/pallad-core'
import * as bip32 from '@scure/bip32'
import { ethers, hashMessage, recoverAddress, SignatureLike } from 'ethers'
import sinon from 'sinon'
import { expect } from 'vitest'

import { ChainOperationArgs, ChainSignablePayload } from '../../src'
import { EthereumSpecificArgs } from '../../src/chains/Ethereum'
//import { emip3encrypt } from '../src/emip3'
import {
  FromBip39MnemonicWordsProps,
  //getPassphraseRethrowTypedError,
  InMemoryKeyAgent
} from '../../src/InMemoryKeyAgent'
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

      await agent.restoreKeyAgent(args, getPassphrase)
      expect(agent).to.be.instanceOf(InMemoryKeyAgent)
      expect(
        agent.serializableData.credentialSubject.contents[0]?.address
      ).to.deep.equal(expectedGroupedCredentials.address)
    })
  })
  describe('KeyAgent signing', () => {
    it('should sign a message', async () => {
      const args: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }

      await agent.restoreKeyAgent(args, getPassphrase)

      const signable: ChainSignablePayload = 'hi bob'
      const operationArsg: ChainOperationArgs = {
        operation: 'eth_signMessage',
        network: 'Ethereum'
      }

      const signedMessage = await agent.sign(
        agent.serializableData.credentialSubject.contents[0]!,
        signable,
        operationArsg
      )
      const signerAddress = recoverAddress(
        hashMessage(signable),
        signedMessage as SignatureLike
      )
      expect(signerAddress).toBe('0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9')
    })
    // todo: replace ethers signers with micro-eth-signer
    it.skip('should sign a transaction', async () => {
      const args: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }

      await agent.restoreKeyAgent(args, getPassphrase)

      // Creating a mock transaction object
      const transaction: ethers.TransactionRequest = {
        to: '0x1234567890abcdef1234567890abcdef12345678',
        value: ethers.parseUnits('0.1', 'ether'), // Sending 0.1 ether
        data: '0x', // No additional data
        chainId: 1, // Ethereum mainnet
        nonce: 0 // Assume this is the first transaction
      }

      const operationArgs: ChainOperationArgs = {
        operation: 'eth_signTransaction',
        network: 'Ethereum'
      }

      // Signing the transaction
      const signedTx = await agent.sign(
        agent.serializableData.credentialSubject.contents[0]!,
        transaction,
        operationArgs
      )

      const signerAddress = recoverAddress(
        hashMessage(String(transaction)),
        signedTx as SignatureLike
      )

      expect(signerAddress).toBe('0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9')
    })

    it('should throw on invalid operation', async () => {
      const args: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }

      await agent.restoreKeyAgent(args, getPassphrase)

      // Creating a mock transaction object
      const transaction: ethers.TransactionRequest = {
        to: '0x1234567890abcdef1234567890abcdef12345678',
        value: ethers.parseUnits('0.1', 'ether'), // Sending 0.1 ether
        data: '0x', // No additional data
        chainId: 1, // Ethereum mainnet
        nonce: 0 // Assume this is the first transaction
      }

      const operationArgs: ChainOperationArgs = {
        operation: 'eth_NotAMethod',
        network: 'Ethereum'
      }

      // Signing the transaction
      try {
        await agent.sign(
          agent.serializableData.credentialSubject.contents[0]!,
          transaction,
          operationArgs
        )
        fail('Expected an error but did not get one.')
      } catch (error) {
        expect(error.message).toContain('Unsupported private key operation')
      }
    })
  })
})
