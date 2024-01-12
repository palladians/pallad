import { TransactionRequest } from 'ethers'

import { ChainPublicKey, ChainSpecificPayload, Network } from '../../types'
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

  async derivePublicKey(privateKey: Uint8Array): Promise<ChainPublicKey> {
    return deriveEthereumPublicAddress(privateKey)
  }
  async derivePrivateKey(
    decryptedSeedBytes: Uint8Array,
    args: EthereumSpecificArgs
  ): Promise<string> {
    return deriveEthereumPrivateKey(args, decryptedSeedBytes)
  }
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
