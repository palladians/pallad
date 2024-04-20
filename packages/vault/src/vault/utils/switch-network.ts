import { AddressError } from '../../lib/Errors'

export async function switchNetworkHelper(get: any, networkName: string) {
  // if the network info is already stored we can just switch to it using the networkName
  const {
    setCurrentNetworkName,
    getCurrentWallet,
    _syncWallet,
    ensureAccount
  } = get()
  const currentWallet = getCurrentWallet()
  console.log('got current wallet...', currentWallet)
  if (!currentWallet)
    throw new Error('Current wallet is null, empty or undefined')
  const publicKey = await getCurrentWallet()?.credential?.credential?.address // todo: DRY this up
  console.log('got current wallet public key...', publicKey)

  if (!publicKey)
    throw new AddressError(
      'Wallet address is undefined in switchNetwork method'
    )
  console.log(
    `ensuring account ${publicKey} on network ${networkName} exists...`
  )
  ensureAccount(networkName, publicKey)
  console.log('ensured account')
  await setCurrentNetworkName(networkName)
  console.log('set current network to', networkName)
  console.log('syncing wallet...')
  await _syncWallet(networkName)
}
