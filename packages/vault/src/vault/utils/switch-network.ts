import { AddressError } from "../../lib/Errors"

export async function switchNetworkHelper(get: any, networkId: string) {
  // if the network info is already stored we can just switch to it using the networkName
  const { getCurrentWallet, _syncWallet, ensureAccount } = get()
  const currentWallet = await getCurrentWallet()
  if (!currentWallet)
    throw new Error("Current wallet is null, empty or undefined")
  const publicKey = currentWallet.credential?.credential?.address
  if (!publicKey)
    throw new AddressError(
      "Wallet address is undefined in switchNetwork method",
    )

  ensureAccount(networkId, publicKey)

  await _syncWallet(networkId)
}
