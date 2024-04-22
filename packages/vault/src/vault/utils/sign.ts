import {
  ChainOperationArgs,
  ChainSignablePayload,
  GetPassphrase,
  GroupedCredentials,
  InMemoryKeyAgent
} from '@palladxyz/key-management'

import { WalletError } from '../../lib/Errors'

export async function signHelper(
  get: any,
  signable: ChainSignablePayload,
  args: ChainOperationArgs,
  getPassphrase: GetPassphrase
) {
  const { getCurrentWallet, restoreKeyAgent } = get()
  const currentWallet = getCurrentWallet()
  // use current wallet to sign
  if (!currentWallet?.credential) {
    throw new WalletError(
      'Current wallet is null, empty or undefined in sign method'
    )
  }
  if (!currentWallet.singleKeyAgentState) {
    throw new WalletError('Key agent state is not set')
  }
  const keyAgentState = currentWallet.singleKeyAgentState
  if (keyAgentState === null) {
    throw new WalletError('Key agent state is undefined in sign method')
  }
  const credential = currentWallet.credential.credential as GroupedCredentials

  let keyAgent: InMemoryKeyAgent | undefined | null
  keyAgent = restoreKeyAgent(keyAgentState.name, getPassphrase)
  const signed = await keyAgent?.sign(credential, signable, args)
  keyAgent = null
  return signed
}
