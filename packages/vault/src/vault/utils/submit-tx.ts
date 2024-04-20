import { SubmitTxArgs } from '@palladxyz/pallad-core'
import { createChainProvider } from '@palladxyz/providers'

import { AddressError } from '../../lib/Errors'

export async function submitTxHelper(get: any, submitTxArgs: SubmitTxArgs) {
  const { getCurrentNetworkInfo, getCurrentWallet, _syncTransactions } = get()
  const providerConfig = getCurrentNetworkInfo()
  const provider = createChainProvider(providerConfig)
  const publicKey = getCurrentWallet().credential.credential?.address
  if (!publicKey)
    throw new AddressError('Wallet address is undefined in submitTx method')
  const txResult = await provider.submitTransaction(submitTxArgs)
  await _syncTransactions(providerConfig, publicKey)
  return txResult
}
