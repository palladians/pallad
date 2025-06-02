import type { SingleCredentialState } from "../../credentials"
import { WalletError } from "../../lib/Errors"
import type { CurrentWalletPayload } from "../vaultState"

export async function updateCurrentWalletHelper(
  get: any,
  payload: CurrentWalletPayload,
) {
  const { credentials, _setCurrentWallet, setCredential, getCredential } = get()
  const credential = getCredential(payload.credentialName)
  if (!credential.credential?.address) {
    throw new WalletError("Invalid current wallet or address")
  }
  const latestSelected = (
    Object.values(credentials) as SingleCredentialState[]
  ).reduce((a, c) => Math.max(c.lastSelected ?? 0, a), 0)
  setCredential({
    ...credential,
    lastSelected: latestSelected + 1,
  })
  _setCurrentWallet(payload)
}
