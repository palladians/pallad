import { BorrowedTypes, Mina } from '@palladxyz/mina-core'
import { Network } from '@palladxyz/pallad-core'

import { ChainSpecificPayload, KeyPairDerivationOperations } from '../../types'
import { deriveMinaPublicKey } from './credentialDerivation'
import { deriveMinaPrivateKey } from './keyDerivation'

export type MinaSignatureResult =
  | Mina.SignedTransaction
  | Mina.SignedMessage
  | Mina.SignedFields
  | Mina.SignedZkAppCommand
  | BorrowedTypes.Nullifier

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
  operation?: string // optional for now
}

export type MinaDerivationArgs = {
  network: Network.Mina
  accountIndex: number
  addressIndex: number
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
  encryptedPrivateKeyBytes: Uint8Array
}

export type MinaSignablePayload =
  | Mina.ConstructedTransaction
  | Mina.MessageBody
  | Mina.SignableFields
  | Mina.SignableZkAppCommand
  | Mina.CreatableNullifer

export class MinaPayload implements ChainSpecificPayload {
  network = Network.Mina

  derivePublicKey(privateKey: string) {
    return new Promise<string>((resolve) =>
      resolve(deriveMinaPublicKey(privateKey))
    )
  }
  derivePrivateKey(decryptedSeedBytes: Uint8Array, args: MinaSpecificArgs) {
    return new Promise<string>((resolve) =>
      resolve(deriveMinaPrivateKey(args, decryptedSeedBytes))
    )
  }
}
// new functional implementation of MinaPayload
export const minaKeyPairDerivationOperations: KeyPairDerivationOperations<MinaDerivationArgs> =
  {
    derivePublicKey: (privateKey: Uint8Array | string) => {
      if (typeof privateKey === 'string') {
        return Promise.resolve(deriveMinaPublicKey(privateKey))
      } else {
        throw new Error('Invalid type for privateKey; string required.')
      }
    },
    derivePrivateKey: (
      decryptedSeedBytes: Uint8Array,
      args: MinaDerivationArgs
    ) => Promise.resolve(deriveMinaPrivateKey(args, decryptedSeedBytes))
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
