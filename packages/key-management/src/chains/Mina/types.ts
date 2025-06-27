import type { Mina } from "@palladco/mina-core"
import { Network } from "@palladco/pallad-core"

import type {
  Nullifier,
  SignedFields,
  SignedMessage,
  SignedTransaction,
  TransactionOrZkAppCommandProperties,
} from "@mina-js/utils"
import type {
  ChainSpecificPayload,
  KeyPairDerivationOperations,
} from "../../types"
import { deriveMinaPublicKey } from "./credentialDerivation"
import { deriveMinaPrivateKey } from "./keyDerivation"

export type MinaSignatureResult =
  | SignedTransaction
  | SignedMessage
  | SignedFields
  | Nullifier

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
  "@context": ["https://w3id.org/wallet/v1"]
  id: string
  type: "MinaAddress"
  controller: string
  name: string
  description: string
  chain: Network.Mina
  addressIndex: number
  accountIndex: number
  address: Mina.PublicKey
  encryptedPrivateKeyBytes: Uint8Array
}

export type MinaSessionCredentials = {
  "@context": ["https://w3id.org/wallet/v1"]
  id: string
  type: "MinaSessionKey"
  controller: string
  name: string
  description: string
  chain: Network.Mina
  addressIndex: number
  accountIndex: number
  address: Mina.PublicKey
  privateKeyBytes: Uint8Array
}

export type MinaSignablePayload =
  | TransactionOrZkAppCommandProperties
  | Mina.MessageBody
  | Mina.SignableFields
  | Mina.CreatableNullifer

export class MinaPayload implements ChainSpecificPayload {
  network = Network.Mina

  derivePublicKey(privateKey: Uint8Array) {
    return new Promise<string>((resolve) =>
      resolve(deriveMinaPublicKey(privateKey)),
    )
  }
  derivePrivateKey(decryptedSeedBytes: Uint8Array, args: MinaSpecificArgs) {
    return new Promise<Uint8Array>((resolve) =>
      resolve(deriveMinaPrivateKey(args, decryptedSeedBytes)),
    )
  }
}
// new functional implementation of MinaPayload
export const minaKeyPairDerivationOperations: KeyPairDerivationOperations<MinaDerivationArgs> =
  {
    derivePublicKey: (privateKey: Uint8Array) => {
      if (privateKey instanceof Uint8Array) {
        return Promise.resolve(deriveMinaPublicKey(privateKey))
      }
      throw new Error("Invalid type for privateKey - string required.")
    },
    derivePrivateKey: (
      decryptedSeedBytes: Uint8Array,
      args: MinaDerivationArgs,
    ) => Promise.resolve(deriveMinaPrivateKey(args, decryptedSeedBytes)),
  }

export enum MinaKeyConst {
  /**
   * Constant value used for defining the purpose in a BIP44 path
   */
  PURPOSE = 44,

  /**
   * COIN_TYPE value for Mina network
   */
  MINA_COIN_TYPE = 12586,
}
