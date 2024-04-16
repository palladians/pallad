import { TransactionRequest } from 'ethers'

import {
  ChainSpecificPayload,
  KeyPairDerivationOperations,
  Network
} from '../../types'
import { deriveEthereumPublicAddress } from './credentialDerivation'
import { deriveEthereumPrivateKey } from './keyDerivation'

export type EthereumSpecificPayload = {
  network: Network.Ethereum
  accountIndex: number
  addressIndex: number
}

export type EthereumSpecificArgs = {
  network: Network.Ethereum
  accountIndex: number
  addressIndex: number
  operation?: string
}

export type EthereumDerivationArgs = {
  network: Network.Ethereum
  accountIndex: number
  addressIndex: number
}

export type EthereumSignablePayload = TransactionRequest | string | Uint8Array
export type EthereumSignatureResult = string

export type EthereumGroupedCredentials = {
  '@context': ['https://w3id.org/wallet/v1']
  id: string
  type: 'EthereumAddress'
  controller: string
  name: string
  description: string
  chain: Network.Ethereum
  addressIndex: number
  accountIndex: number
  address: string
  encryptedPrivateKeyBytes: Uint8Array
}

export class EthereumPayload implements ChainSpecificPayload {
  network = Network.Ethereum

  derivePublicKey(privateKey: Uint8Array) {
    return new Promise<string>((resolve) =>
      resolve(deriveEthereumPublicAddress(privateKey))
    )
  }
  derivePrivateKey(decryptedSeedBytes: Uint8Array, args: EthereumSpecificArgs) {
    return new Promise<string>((resolve) =>
      resolve(deriveEthereumPrivateKey(args, decryptedSeedBytes))
    )
  }
}

// new functional implementation of EthereumPayload
export const ethKeyPairDerivationOperations: KeyPairDerivationOperations<EthereumDerivationArgs> =
  {
    derivePublicKey: (privateKey: Uint8Array | string) => {
      return Promise.resolve(deriveEthereumPublicAddress(privateKey))
    },
    derivePrivateKey: (
      decryptedSeedBytes: Uint8Array,
      args: EthereumDerivationArgs
    ) => Promise.resolve(deriveEthereumPrivateKey(args, decryptedSeedBytes))
  }

export const enum EthereumKeyConst {
  /**
   * Constant value used for defining the purpose in a BIP44 path
   */
  PURPOSE = 44,

  /**
   * COIN_TYPE value for Ethereum network
   */
  COIN_TYPE = 60
}
