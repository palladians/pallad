import type {
  ChainDerivationArgs,
  FromBip39MnemonicWordsProps,
} from "@palladxyz/key-management"
import { getSecurePersistence } from "@palladxyz/persistence"
import { createChainProvider } from "@palladxyz/providers"

import type { CredentialName, SingleCredentialState } from "../../credentials"
import type { KeyAgentName, KeyAgents } from "../../keyAgent"
import { WalletError } from "../../lib/Errors"
import { getRandomAnimalName } from "../../lib/utils"

export async function restoreWalletHelper(
  get: any,
  args: ChainDerivationArgs,
  network: string,
  { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
  keyAgentName: KeyAgentName,
  keyAgentType: KeyAgents,
  credentialName: CredentialName = getRandomAnimalName(),
) {
  const {
    initialiseKeyAgent,
    restoreKeyAgent,
    setCredential,
    setCurrentWallet,
    _syncWallet,
    ensureAccount,
    setKnownAccounts,
    getCurrentNetworkInfo,
    updateNetworkInfo,
    setCurrentNetworkName,
  } = get()
  const agentArgs: FromBip39MnemonicWordsProps = {
    getPassphrase: getPassphrase,
    mnemonicWords: mnemonicWords,
    mnemonic2ndFactorPassphrase: "",
  }
  // TODO: this should be a key agent method? can we simplify this?
  await initialiseKeyAgent(keyAgentName, keyAgentType, agentArgs)
  const keyAgent = restoreKeyAgent(keyAgentName, getPassphrase)
  if (!keyAgent)
    throw new WalletError("keyAgent is undefined in restoreWallet method") // TODO: we can derive credential direct from the key Agent Store
  const derivedCredential = await keyAgent?.deriveCredentials(
    args,
    getPassphrase,
    true, // has to be true
  )
  if (!derivedCredential)
    throw new WalletError(
      "Derived credential is undefined in restoreWallet method",
    )
  const singleCredentialState: SingleCredentialState = {
    credentialName: credentialName,
    keyAgentName: keyAgentName,
    credential: derivedCredential,
  }
  // TODO: set the current network info, restore and create wallet
  // should take some providerConfig object
  setCredential(singleCredentialState)
  setCurrentWallet({
    keyAgentName,
    credentialName,
    currentAccountIndex: derivedCredential.accountIndex,
    currentAddressIndex: derivedCredential.addressIndex,
  })
  // set the first known account
  setKnownAccounts(derivedCredential.address)
  // set the chainIds
  const providerConfig = getCurrentNetworkInfo()
  if (!providerConfig) {
    throw new Error(
      `Could not find providerConfig for ${providerConfig} in updateChainId`,
    )
  }

  const provider = createChainProvider(providerConfig)
  if (!provider.getNodeStatus) {
    throw new Error(
      `Could not getNodeStatus for ${providerConfig} in updateChainId`,
    )
  }

  const response = await provider.getNodeStatus()
  if (!response.daemonStatus.chainId) {
    throw new Error(
      `Could not get chainId for ${providerConfig} in updateChainId`,
    )
  }
  updateNetworkInfo(providerConfig.networkName, {
    chainId: response.daemonStatus.chainId,
  })
  setCurrentNetworkName(providerConfig.networkName)
  ensureAccount(network, derivedCredential.address)
  getSecurePersistence().setItem("foo", "bar" as any)
  await _syncWallet()
}
