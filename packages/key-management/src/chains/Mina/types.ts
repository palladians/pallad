import { Mina } from '@palladxyz/mina-core'

import { ChainSpecificPayload_, Network } from '../../types'
import { ChainPublicKey } from '../../types'
import { deriveMinaPublicKey } from './credentialDerivation'
import { deriveMinaPrivateKey } from './keyDerivation'

export type MinaSignatureResult =
  | Mina.SignedTransaction
  | Mina.SignedMessage
  | Mina.SignedFields
  | Mina.SignedZkAppCommand

export type MinaSpecificPayload = {
  network: Network.Mina
  accountIndex: number
  addressIndex: number
  networkType: Mina.NetworkType
}

export type MinaSpecificArgs = {
  network: Network.Mina
  accountIndex: number
  addressIndex: number
  networkType: Mina.NetworkType
}

export type MinaGroupedCredentials = {
  '@context': ['https://w3id.org/wallet/v1']
  id: string
  type: 'MinaAddress'
  controller: string
  name: string
  description: string
  chain: Network.Mina
  addressIndex: number
  accountIndex: number
  address: Mina.PublicKey
}

export type MinaSignablePayload =
  | Mina.ConstructedTransaction
  | Mina.MessageBody
  | Mina.SignableFields
  | Mina.SignableZkAppCommand

export class MinaPayload implements ChainSpecificPayload_ {
  network = Network.Mina

  async derivePublicKey(
    privateKey: string,
    args: MinaSpecificArgs
  ): Promise<ChainPublicKey> {
    return deriveMinaPublicKey(args, privateKey)
  }
  async derivePrivateKey(
    decryptedSeedBytes: Uint8Array,
    args: MinaSpecificArgs
  ): Promise<string> {
    return deriveMinaPrivateKey(args, decryptedSeedBytes)
  }
}

export const enum MinaKeyConst {
  /**
   * Constant value used for defining the purpose in a BIP44 path
   */
  PURPOSE = 44,

  /**
   * COIN_TYPE value for Mina network
   */
  MINA_COIN_TYPE = 12586
}

/**
 * This enumeration holds the different types of Mina networks.
 *
 * @remarks
 * Add any new Mina networks to this enum as part of the {@link pallad#key-generator | key-generator subsystem}.
 *
 * @beta
 */

export enum MinaNetwork {
  /**
   * Mina mainnet network option
   */
  Mainnet = 'Mainnet',
  /**
   * Mina devnet network option
   */
  Devnet = 'Devnet',
  /**
   * Mina berkeley network option
   */
  Berkeley = 'Berkeley'
}
