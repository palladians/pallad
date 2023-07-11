import { Mina } from '@palladxyz/mina-core'
import { HDKey } from '@scure/bip32'
import * as bs58check from 'bs58check'
import { Buffer } from 'buffer'
import Client from 'mina-signer'
import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import * as util from './util'

import * as errors from './errors'
import { KeyDecryptor } from './KeyDecryptor'
import { GetPassphrase, KeyConst, Network } from './types'
import {
  AccountAddressDerivationPath,
  AccountKeyDerivationPath,
  GroupedCredentials,
  KeyAgent,
  SerializableKeyAgentData
} from './types'

export abstract class KeyAgentBase implements KeyAgent {
  readonly #serializableData: SerializableKeyAgentData
  private keyDecryptor: KeyDecryptor

  get knownCredentials(): GroupedCredentials[] {
    return this.#serializableData.knownCredentials
  }
  set knownCredentials(credentials: GroupedCredentials[]) {
    this.#serializableData.knownCredentials = credentials
  }
  get serializableData(): SerializableKeyAgentData {
    return this.#serializableData
  }

  constructor(
    serializableData: SerializableKeyAgentData,
    getPassphrase: GetPassphrase
  ) {
    this.#serializableData = serializableData
    this.keyDecryptor = new KeyDecryptor(serializableData, getPassphrase)
  }

  async deriveCredentials(
    { account_ix }: AccountKeyDerivationPath,
    { address_ix }: AccountAddressDerivationPath,
    network: Network,
    networkType: Mina.NetworkType,
    pure?: boolean
  ): Promise<GroupedCredentials> {
    const knownAddress = this.knownCredentials.find(
      (credential) =>
        credential.accountIndex === account_ix &&
        credential.addressIndex === address_ix &&
        credential.chain === network
    )

    if (knownAddress) return knownAddress
    const derivedPublicKey = await this.derivePublicKey(
      { account_ix },
      { address_ix },
      network,
      networkType
    )

    const groupedCredentials: GroupedCredentials = {
      chain: network,
      addressIndex: address_ix,
      accountIndex: account_ix,
      address: derivedPublicKey
    }

    if (!pure)
      this.knownCredentials = [...this.knownCredentials, groupedCredentials]

    return groupedCredentials
  }
  /**
   * Reverses the order of bytes in a buffer.
   *
   * @param bytes - Buffer containing bytes to reverse.
   * @returns Buffer with bytes in reverse order.
   */
  reverseBytes(bytes: Buffer) {
    const uint8 = new Uint8Array(bytes)
    return new Buffer(uint8.reverse())
  }

  async decryptSeed(): Promise<Uint8Array> {
    try {
      return await this.keyDecryptor.decryptSeedBytes()
    } catch (error) {
      throw new Error(`Failed to decrypt root private key: ${error}`)
    }
  }

  async exportRootPrivateKey(): Promise<Uint8Array> {
    try {
      const decryptedSeedBytes = await this.decryptSeed()
      const rootKey = HDKey.fromMasterSeed(decryptedSeedBytes)
      return rootKey.privateKey ? rootKey.privateKey : new Uint8Array([])
    } catch (error) {
      throw new errors.AuthenticationError(
        'Failed to export root private key',
        error
      )
    }
  }

  async derivePublicKey(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    network: Network,
    networkType: Mina.NetworkType
  ): Promise<Mina.PublicKey> {
    // Eventually this should be network agnostic
    // goal should be to minimise decryption of private keys
    if (network === Network.Mina) {
      // Mina network client.
      const minaClient = new Client({ network: networkType })
      // Generate the private key
      const privateKey = await this.#generatePrivateKeyFromSeed(
        accountDerivationPath.account_ix,
        addressDerivationPath.address_ix
      )

      // Derive and return the Mina public key
      const publicKey = minaClient.derivePublicKey(privateKey)

      return publicKey as Mina.PublicKey
    } else {
      throw new Error('Unsupported network')
    }
  }
  /**
   * Signs a transaction 
   */
  async signTransaction(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    transaction: Mina.ConstructedTransaction,
    networkType: Mina.NetworkType
  ): Promise<Mina.SignedTransaction> {
    let signedTransaction: SignedLegacy<Mina.ConstructedTransaction>

    // Mina network client.
    const minaClient = new Client({ network: networkType })
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(
      accountDerivationPath.account_ix,
      addressDerivationPath.address_ix
    )
    // Sign the transaction
    try {
      signedTransaction = minaClient.signTransaction(transaction, privateKey)
    } catch (err) {
      const errorMessage =
        errors.getRealErrorMsg(err) || 'Signing transaction failed.'
      throw new Error(errorMessage)
    }

    return signedTransaction
  }

  async signMessage(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    message: Mina.MessageBody,
    networkType: Mina.NetworkType
  ): Promise<Mina.SignedMessage> {
    // Mina network client.
    const minaClient = new Client({ network: networkType })
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(
      accountDerivationPath.account_ix,
      addressDerivationPath.address_ix
    )
    // Sign the message
    const signature = minaClient.signMessage(message.message, privateKey)

    return signature
  }

  async sign<T>(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    payload: T,
    networkType: Mina.NetworkType,
  ): Promise<Mina.SignedTransaction | Mina.SignedMessage> {
    // Mina network client.
    const minaClient = new Client({ network: networkType })
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(
      accountDerivationPath.account_ix,
      addressDerivationPath.address_ix
    )
  
    // Perform the specific signing action
    try {
      if (util.isConstructedTransaction(payload)) {
        return minaClient.signTransaction(payload, privateKey);
      } else if (util.isMessageBody(payload)) {
        return minaClient.signMessage(payload.message, privateKey);
      } else {
        throw new Error("Unsupported payload type.");
      }
    } catch (err) {
      const errorMessage = errors.getRealErrorMsg(err) || 'Signing action failed.';
      throw new Error(errorMessage)
    }
  }
  

  async #generatePrivateKeyFromSeed(
    accountIx: number,
    addressIx: number
  ): Promise<string> {
    // Decrypt your root private key first
    const decryptedRootKeyBytes = await this.decryptSeed()

    // Create an HDKey from the root private key
    // TODO: the decryptedRootPrivateKeyBytes is NOT the seed! Need to change this to either the seed or a different function
    const rootKey = HDKey.fromMasterSeed(decryptedRootKeyBytes)
    const path = `m/${KeyConst.PURPOSE}'/${KeyConst.MINA_COIN_TYPE}'/${accountIx}'/0/${addressIx}`
    const childNode = rootKey.derive(path)
    if (!childNode?.privateKey) throw new Error('Unable to derive private key')

    childNode.privateKey[0] &= 0x3f
    const childPrivateKey = this.reverseBytes(new Buffer(childNode.privateKey))
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))

    return privateKey
  }
}
