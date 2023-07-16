import { Mina } from '@palladxyz/mina-core'

import { Network } from '../../types'

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

/*export type MinaGroupedCredentials = {
  chain: Network.Mina
  addressIndex: number
  accountIndex: number
  address: Mina.PublicKey
}*/

export type MinaGroupedCredentials = {
  "@context": [
    "https://w3id.org/wallet/v1"
  ],
  "id": string,
  "type": "MinaAddress",
  "controller": string,
  "name": string,
  "description": string,
  "chain": Network.Mina,
  "addressIndex": number,
  "accountIndex": number,
  "address": Mina.PublicKey
}


export type MinaPayloadType =
  | Mina.ConstructedTransaction
  | Mina.MessageBody
  | Mina.SignableFields

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
