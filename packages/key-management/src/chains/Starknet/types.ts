import { ChainPublicKey, ChainSpecificPayload, Network } from '../../types'
import { deriveStarknetPublicAddress } from './credentialDerivation'
import { deriveStarknetPrivateKey } from './keyDerivation'

export type StarknetSpecificPayload = {
  network: Network.Starknet
  ethAddress: string
  addressIndex: number
}

export type StarknetSpecificArgs = {
  network: Network.Starknet
  layer: string
  application: string
  ethAddress: string
  addressIndex: number
}

export type StarknetGroupedCredentials = {
  '@context': ['https://w3id.org/wallet/v1']
  id: string
  type: 'StarknetAddress'
  controller: string
  name: string
  description: string
  chain: Network.Starknet
  addressIndex: number
  address: string
}

export class StarknetPayload implements ChainSpecificPayload {
  network = Network.Starknet

  async derivePublicKey(privateKey: Uint8Array): Promise<ChainPublicKey> {
    return deriveStarknetPublicAddress(privateKey)
  }

  async derivePrivateKey(
    decryptedSeedBytes: Uint8Array,
    args: StarknetSpecificArgs
  ): Promise<Uint8Array> {
    const privateKey = await deriveStarknetPrivateKey(args, decryptedSeedBytes)
    return new Uint8Array(Buffer.from(privateKey, 'hex'))
  }
}
