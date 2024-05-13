import { Mina } from "@palladxyz/mina-core"
import { useFiatPrice } from "@palladxyz/offchain-data"
import { useNavigate } from "react-router-dom"

import MinaIcon from "@/common/assets/mina.svg?react"
import { type StructurizedTransaction, TxSide } from "@/common/types"

import { TxIndicator } from "./tx-indicator"

interface TxTileProps {
  tx: StructurizedTransaction
}

const fiatTxValue = (amount, fiatValue) => {
  if (!amount || !fiatValue) return 0
  return Number(amount) * fiatValue
}

const getTransactionLabel = (tx) => {
  if (tx.kind === Mina.TransactionKind.STAKE_DELEGATION) return "Delegation"
  if (tx.from === tx.to && tx.kind === Mina.TransactionKind.PAYMENT)
    return "Sent to Self"
  return tx.side === TxSide.INCOMING ? "Received" : "Sent"
}

export const TxTile = ({ tx }: TxTileProps) => {
  const navigate = useNavigate()
  const { current: rawFiatPrice } = useFiatPrice()
  return (
    <div
      key={tx.hash}
      className="flex justify-between items-center gap-4 cursor-pointer"
      onClick={() => navigate(`/transactions/${tx.hash}`)}
    >
      {tx.kind && (
        <TxIndicator side={tx.side} kind={tx.kind} from={tx.from} to={tx.to} />
      )}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-1 font-semibold">{getTransactionLabel(tx)}</div>
        <div className="flex-1 text-sm">{tx.time}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center font-semibold">
          <span>{tx.txTotalMinaAmount}</span>
          <MinaIcon width={20} height={20} />
        </div>
        <div className="flex items-center text-xs">
          <span>
            {fiatTxValue(tx.txTotalMinaAmount, rawFiatPrice).toFixed(3)}
          </span>
          <span className="ml-1">USD</span>
        </div>
      </div>
    </div>
  )
}
