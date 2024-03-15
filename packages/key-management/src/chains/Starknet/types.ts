import { ChainPrivateKey, ChainSpecificPayload, Network } from '../../types'
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
  accountIndex: number
  addressIndex: number
  address: string
  encryptedPrivateKeyBytes: Uint8Array
}

export class StarknetPayload implements ChainSpecificPayload {
  network = Network.Starknet

  derivePublicKey(privateKey: Uint8Array) {
    return new Promise<string>((resolve) =>
      resolve(deriveStarknetPublicAddress(privateKey))
    )
  }

  derivePrivateKey(decryptedSeedBytes: Uint8Array, args: StarknetSpecificArgs) {
    const privateKey = deriveStarknetPrivateKey(args, decryptedSeedBytes)
    return new Promise<ChainPrivateKey>((resolve) =>
      resolve(new Uint8Array(Buffer.from(privateKey, 'hex')))
    )
  }
}
