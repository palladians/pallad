import { utf8ToBytes } from "@noble/hashes/utils"
import type { ChainDerivationArgs } from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
import type { SingleCredentialState } from "../../credentials"
import { WalletError } from "../../lib/Errors"
import { sessionPersistence } from "../../utils"
import { useVault } from "../vaultStore"

export async function deriveAccountHelper(get: any, credentialName: string) {
  const {
    restoreKeyAgent,
    keyAgentName,
    knownAccounts,
    setKnownAccounts,
    addAccount,
    getNetworkId,
    setCurrentWallet,
    setCredential,
  } = get()
  const spendingPassword =
    (await sessionPersistence.getItem("spendingPassword")) || ""
  const getPassphrase = () => utf8ToBytes(spendingPassword)
  await useVault.persist.rehydrate()
  const keyAgent = restoreKeyAgent(keyAgentName, getPassphrase)
  if (!keyAgent)
    throw new WalletError("keyAgent is undefined in restoreWallet method")
  await useVault.persist.rehydrate()

  const derivedAccountIndex = knownAccounts.length + 1

  const args: ChainDerivationArgs = {
    network: Network.Mina,
    accountIndex: derivedAccountIndex,
    addressIndex: derivedAccountIndex,
  }

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

  setCredential(singleCredentialState)
  setCurrentWallet({
    keyAgentName,
    credentialName,
    currentAccountIndex: derivedAccountIndex,
    currentAddressIndex: derivedAccountIndex,
  })
  setKnownAccounts(derivedCredential.address)
  addAccount(getNetworkId(), derivedCredential.address)
}
