import { AddressError } from '../../lib/Errors'

export function getBalanceHelper(get: any, ticker: string | undefined) {
  if (!ticker) ticker = 'MINA'
  const { getCurrentWallet, getCurrentNetworkInfo, getAccountInfo } = get()
  const currentWallet = getCurrentWallet()
  const currentNetwork = getCurrentNetworkInfo()
  const publicKey = currentWallet.credential.credential?.address
  if (!publicKey)
    throw new AddressError('Wallet address is undefined in getBalance method')
  const accountInfo = getAccountInfo(
    currentNetwork.networkName,
    publicKey,
    ticker
  )
  return accountInfo.balance.total
}
