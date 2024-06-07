import { AddressError } from "../../lib/Errors"

export async function switchNetworkHelper(get: any, networkName: string) {
  // if the network info is already stored we can just switch to it using the networkName
  const {
    setCurrentNetworkName,
    getCurrentWallet,
    _syncWallet,
    ensureAccount,
  } = get()
  const currentWallet = getCurrentWallet()
  if (!currentWallet)
    throw new Error("Current wallet is null, empty or undefined")
  const publicKey = await getCurrentWallet()?.credential?.credential?.address // todo: DRY this up
  if (!publicKey)
    throw new AddressError(
      "Wallet address is undefined in switchNetwork method",
    )

  ensureAccount(networkName, publicKey)
  await setCurrentNetworkName(networkName)

  await _syncWallet(networkName)
}
