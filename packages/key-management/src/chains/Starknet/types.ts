import { ChainPublicKey, ChainSpecificPayload_, Network } from '../../types'

export type StarknetSpecificPayload = {
  network: Network.Starknet
  accountIx: number
  addressIx: number
}

export type StarknetSpecificArgs = {
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

export class StarknetPayload implements ChainSpecificPayload_ {
  network = Network.Starknet

  async derivePublicKey(): Promise<ChainPublicKey> {
    return 'Not implemented yet'
  }
  async derivePrivateKey(): Promise<string> {
    return 'Not implemented yet'
  }
}
