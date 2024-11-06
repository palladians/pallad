import type { GroupedCredentials } from "@palladxyz/key-management"

import { AddressError, NetworkError, WalletError } from "../../lib/Errors"

export function getWalletTransactionsHelper(get: any) {
  const { getCurrentWallet, getCurrentNetworkId, getTransactions } = get()
  const currentWallet = getCurrentWallet()
  if (!currentWallet)
    throw new WalletError(
      "Current wallet is null, empty or undefined in getTransactions method",
    )
  const walletCredential = currentWallet.credential
    .credential as GroupedCredentials
  const walletAddress = walletCredential?.address
  if (!walletAddress)
    throw new AddressError(
      "Wallet address is undefined in getTransactions method",
    )
  const currentNetwork = getCurrentNetworkId()
  if (!currentNetwork)
    throw new NetworkError(
      "Current network is null, empty or undefined in getTransactions method",
    )
  // TODO: replace 'MINA' with the ProviderConfig default ticker or just return all txs
  return getTransactions(currentNetwork, walletAddress, "MINA") || null
}
