import { Mina } from '@palladxyz/mina-core'
import { HDKey } from '@scure/bip32'
import * as bs58check from 'bs58check'
import { Buffer } from 'buffer'
import Client from 'mina-signer'

import { Network } from './types'
import {
  AccountAddressDerivationPath,
  AccountKeyDerivationPath,
  GroupedCredentials,
  KeyAgent,
  SerializableKeyAgentData
} from './types'

export abstract class KeyAgentBase implements KeyAgent {
  readonly #serializableData: SerializableKeyAgentData

  get knownCredentials(): GroupedCredentials[] {
    return this.#serializableData.knownCredentials
  }
  set knownCredentials(credentials: GroupedCredentials[]) {
    this.#serializableData.knownCredentials = credentials
  }
  get serializableData(): SerializableKeyAgentData {
    return this.#serializableData
  }

  constructor(serializableData: SerializableKeyAgentData) {
    this.#serializableData = serializableData
  }

  async deriveAddress(
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

  // because the decrypt function is a method on InMemoryKeyAgent this function must be abstract
  abstract decryptCoinTypePrivateKey(): Promise<Uint8Array>

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
      // Decrypt your coinType private key first
      const decryptedCoinTypePrivateKeyBytes =
        await this.decryptCoinTypePrivateKey()

      // Create an HDKey from the coinType private key
      const coinTypeKey = HDKey.fromMasterSeed(decryptedCoinTypePrivateKeyBytes)

      // Derive a child key from the given derivation path
      const accountKey = coinTypeKey.deriveChild(
        accountDerivationPath.account_ix
      )
      const changeKey = accountKey.deriveChild(0)
      const addressKey = changeKey.deriveChild(addressDerivationPath.address_ix)

      // Convert the childKey's private key into the format expected by the mina client
      if (!addressKey.privateKey) throw new Error('Private key not found')
      const childPrivateKey = addressKey.privateKey
      childPrivateKey[0] &= 0x3f
      const childPrivateKeyReversed = this.reverseBytes(
        new Buffer(childPrivateKey)
      )
      const privateKeyHex = `5a01${childPrivateKeyReversed}`
      const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))

      // Derive and return the Mina public key
      console.log('privateKey', privateKey)
      const publicKey = minaClient.derivePublicKey(privateKey)

      return publicKey as Mina.PublicKey
    } else {
      throw new Error('Unsupported network')
    }
  }
}

/**
 * We can also derive addresses from the root key as followed
 */
/*
/*
    // Decrypt your root private key first
    const decryptedRootPrivateKeyBytes = await this.#serializableData.decryptRootPrivateKey()
  
    // Create an HDKey from the root private key
    const rootKey = HDKey.fromMasterSeed(decryptedRootPrivateKeyBytes)
  
    // Derive a child key from the given derivation path
    const purposeKey = rootKey.deriveChild(KeyConst.PURPOSE)
    const coinTypeKey = purposeKey.deriveChild(KeyConst.MINA_COIN_TYPE)
    const accountKey = coinTypeKey.deriveChild(accountDerivationPath.account_ix)
    const changeKey = accountKey.deriveChild(0)
    const addressKey = changeKey.deriveChild(addressDerivationPath.address_ix)

  
    // Convert the childKey's private key into the format expected by the mina client
    if (!addressKey.privateKey) throw new Error('Private key not found')
    const childPrivateKey = addressKey.privateKey
    childPrivateKey[0] &= 0x3f
    const childPrivateKeyReversed = this.reverseBytes(new Buffer(childPrivateKey))
    const privateKeyHex = `5a01${childPrivateKeyReversed}`
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))

  
    // Derive and return the Mina public key
    console.log('privateKey', privateKey)
    const publicKey = minaClient.derivePublicKey(privateKey)
  
    return publicKey as Mina.PublicKey
    */
