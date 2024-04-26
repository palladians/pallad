import { Network } from "@palladxyz/pallad-core"

import type { EthereumDerivationArgs } from "./types"

export function isEthereumDerivation(args: EthereumDerivationArgs): boolean {
  // check if derivation args match Mina
  return args.network === Network.Ethereum
}
