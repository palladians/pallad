import type { GroupedCredentials } from "@palladxyz/key-management"
import type { Network } from "@palladxyz/pallad-core"

import type { SingleCredentialState } from "../../credentials"
import { NetworkError, WalletError } from "../../lib/Errors"

const _validateCurrentWallet = (wallet: SingleCredentialState | null) => {
  const credential = wallet?.credential as GroupedCredentials
  if (!wallet || !credential?.address)
    throw new WalletError("Invalid current wallet or address")
}
const _validateCurrentNetwork = (network: Network | null) => {
  if (!network) throw new NetworkError("Invalid current network")
}

export function getWalletAccountInfoHelper(get: any) {
  const { getCurrentWallet, getCurrentNetworkId, getAccountsInfo } = get()
  const currentWallet = getCurrentWallet()
  _validateCurrentWallet(currentWallet.credential)
  const currentNetworkId = getCurrentNetworkId()
  _validateCurrentNetwork(currentNetworkId)
  const walletCredential = currentWallet?.credential
    .credential as GroupedCredentials
  return (
    getAccountsInfo(currentNetworkId, walletCredential?.address as string)
      ?.accountInfo || null
  )
}
