import { DEFAULT_NETWORK } from "../network-info"

export const DEFAULT_TOKEN_INFO = {
  [DEFAULT_NETWORK]: { MINA: "1" },
  // Note: when a new network is instantiated in
  // switchNetwork there are no tokens for this network so the accountInfo
  // query will error. We should fix that.
  Devnet: { MINA: "1" },
  ZekoDevNet: { MINA: "1" },
}
