import { Network } from '@palladxyz/pallad-core'

import { EthereumDerivationArgs } from './types'

export function isEthereumDerivation(args: EthereumDerivationArgs): boolean {
  // check if derivation args match Mina
  return args.network === Network.Ethereum
}
