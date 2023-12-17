import { useNavigate } from 'react-router-dom'

import { StructurizedTransaction } from '../../common/types'
import { TxIndicator } from './TxIndicator'

interface TxTileProps {
  tx: StructurizedTransaction
}

export const TxTile = ({ tx }: TxTileProps) => {
  const navigate = useNavigate()
  return (
    <div
      key={tx.hash}
      className="animate-in fade-in flex justify-between items-center gap-4 cursor-pointer"
      onClick={() => navigate(`/transactions/${tx.hash}`)}
    >
      {tx.kind && <TxIndicator side={tx.side} kind={tx.kind} />}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-1 font-semibold">Received</div>
        <div className="flex-1 text-sm">{tx.time}</div>
      </div>
      <div className="font-semibold">{tx.minaAmount} MINA</div>
    </div>
  )
}
