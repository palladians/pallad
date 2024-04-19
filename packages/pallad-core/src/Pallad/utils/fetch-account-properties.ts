import { AccountInfo, Network } from '../providers'

export type AccountProperties = {
  balance: number
  inferredNonce: number
  delegate: string
  publicKey: string
}

export function getAccountProperties(
  data: Record<string, AccountInfo>,
  chain: string
): AccountProperties {
  let balance: number
  let inferredNonce: number
  let delegate: string
  let publicKey: string
  if (chain === Network.Mina) {
    balance = data['MINA']?.balance?.total ?? 0
    inferredNonce = data['MINA']?.inferredNonce ?? 0
    delegate = data['MINA']?.delegate ?? ''
    publicKey = data['MINA']?.publicKey ?? ''
  } else {
    balance = data['ETH']?.balance?.total ?? 0
    inferredNonce = data['ETH']?.inferredNonce ?? 0
    delegate = data['ETH']?.delegate ?? ''
    publicKey = data['ETH']?.publicKey ?? ''
  }

  return { balance, inferredNonce, delegate, publicKey }
}
