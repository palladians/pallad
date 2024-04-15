import { CurrentWallet } from '../vault/vaultState'

export function getPublicKey(currentWallet: CurrentWallet): string {
  const credential = currentWallet.credential.credential
  if (credential === undefined) return ''
  return credential.address
}

export function isDelegated(currentWallet: CurrentWallet) {
  const account = currentWallet.accountInfo['MINA']
  if (account === undefined) return false
  return account.publicKey !== account.delegate
}
