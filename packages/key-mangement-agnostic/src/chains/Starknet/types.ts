import { Network } from '../../types'

export type StarknetSpecificPayload = {
  network: Network.Starknet
  accountIx: number
  addressIx: number
}

export type StarknetGroupedCredentials = {
  chain: Network.Starknet
  addressIndex: number
  accountIndex: number
  address: string
}
