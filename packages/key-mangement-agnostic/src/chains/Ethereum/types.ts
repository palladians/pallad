import { Network } from '../../types'

export type EthereumSpecificPayload = {
  network: Network.Ethereum
  accountIndex: number
  addressIndex: number
}

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
