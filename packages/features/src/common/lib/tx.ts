import { Mina } from "@palladco/mina-core"

type TxSide = "outgoing" | "incoming"

export const getTxSide = ({
  tx,
  currentWalletAddress,
}: {
  tx: Mina.TransactionBody
  currentWalletAddress: string
}): TxSide => {
  if (tx.to === currentWalletAddress) {
    return "incoming"
  }
  return "outgoing"
}

type TxKind = TxSide | "delegation"

export const getTxKind = ({
  tx,
  currentWalletAddress,
}: {
  tx: Mina.TransactionBody
  currentWalletAddress: string
}): TxKind => {
  if (tx.type === Mina.TransactionType.STAKE_DELEGATION) return "delegation"
  return getTxSide({ tx, currentWalletAddress })
}
