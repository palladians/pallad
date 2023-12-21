import { useNavigate } from 'react-router-dom'

import { MinaIcon } from '@/common/components/MinaIcon'

import { StructurizedTransaction, TxKind, TxSide } from '../../common/types'
import { TxIndicator } from './TxIndicator'

interface TxTileProps {
  tx: StructurizedTransaction
}

export const TxTile = ({ tx }: TxTileProps) => {
  const navigate = useNavigate()
  const getTransactionLabel = (tx: StructurizedTransaction) => {
    if (tx.kind === TxKind.STAKE_DELEGATION) {
      return 'Delegation'
    }
    if (tx.from === tx.to && tx.kind === TxKind.PAYMENT) {
      return 'Sent to Self'
    }
    return tx.side === TxSide.INCOMING ? 'Received' : 'Sent'
  }
  return (
    <div
      key={tx.hash}
      className="animate-in fade-in flex justify-between items-center gap-4 cursor-pointer"
      onClick={() => navigate(`/transactions/${tx.hash}`)}
    >
      {tx.kind && (
        <TxIndicator side={tx.side} kind={tx.kind} from={tx.from} to={tx.to} />
      )}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-1 font-semibold">{getTransactionLabel(tx)}</div>
        <div className="flex-1 text-sm">{tx.time}</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center font-semibold">
          <span>{tx.minaAmount}</span>
          <MinaIcon stroke="8" size="18" />
        </div>
        <div className="flex items-center text-xs">
          <span>{tx.minaFee}</span>
          <MinaIcon stroke="8" size="12" />
          <span className="ml-1">Fee</span>
        </div>
      </div>
    </div>
  )
}
