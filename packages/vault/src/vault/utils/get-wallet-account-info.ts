import { GroupedCredentials } from '@palladxyz/key-management'
import { Network } from '@palladxyz/pallad-core'

import { SingleCredentialState } from '../../credentials'
import { NetworkError, WalletError } from '../../lib/Errors'

const _validateCurrentWallet = (wallet: SingleCredentialState | null) => {
  const credential = wallet?.credential as GroupedCredentials
  if (!wallet || !credential?.address)
    throw new WalletError('Invalid current wallet or address')
}
const _validateCurrentNetwork = (network: Network | null) => {
  if (!network) throw new NetworkError('Invalid current network')
}

export function getWalletAccountInfoHelper(get: any) {
  const { getCurrentWallet, getCurrentNetwork, getAccountsInfo } = get()
  const currentWallet = getCurrentWallet()
  _validateCurrentWallet(currentWallet.credential)
  const currentNetwork = getCurrentNetwork()
  _validateCurrentNetwork(currentNetwork)
  const walletCredential = currentWallet?.credential
    .credential as GroupedCredentials
  return (
    getAccountsInfo(currentNetwork, walletCredential?.address as string)
      ?.accountInfo || null
  )
}
