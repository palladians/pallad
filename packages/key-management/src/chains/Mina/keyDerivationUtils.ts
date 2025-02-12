import { Network } from "@palladco/pallad-core"

import type { MinaDerivationArgs } from "./types"

export function isMinaDerivation(args: MinaDerivationArgs): boolean {
  // check if derivation args match Mina
  return args.network === Network.Mina
}
