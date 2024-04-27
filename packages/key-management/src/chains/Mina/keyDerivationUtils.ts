import { Network } from "@palladxyz/pallad-core"

import type { MinaDerivationArgs } from "./types"

/**
 * Reverses the order of bytes in a buffer.
 *
 * @param bytes - Buffer containing bytes to reverse.
 * @returns Buffer with bytes in reverse order.
 */
export function reverseBytes(bytes: Buffer) {
  const uint8 = new Uint8Array(bytes)
  return Buffer.from(uint8.reverse())
}

export function isMinaDerivation(args: MinaDerivationArgs): boolean {
  // check if derivation args match Mina
  return args.network === Network.Mina
}
