import { Network } from '../../types'
import { EthereumDerivationArgs } from './types'

export function isEthereumDerivation(args: EthereumDerivationArgs): boolean {
  // check if derivation args match Mina
  return args.network === Network.Ethereum
}
