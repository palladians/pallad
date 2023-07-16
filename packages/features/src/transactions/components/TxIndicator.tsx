import { ArrowDownLeftIcon, ArrowUpRightIcon, CoinsIcon } from 'lucide-react'

import { TxKind, TxSide } from '../../common/types'

interface TxSideIndicatorProps {
  side: TxSide
  kind: TxKind
}

export const TxIndicator = ({ kind, side }: TxSideIndicatorProps) => {
  return (
    <div className="rounded-full bg-sky-900 w-10 h-10 justify-between items-center">
      {kind === TxKind.PAYMENT ? (
        side === TxSide.INCOMING ? (
          <ArrowDownLeftIcon />
        ) : (
          <ArrowUpRightIcon />
        )
      ) : (
        <CoinsIcon />
      )}
    </div>
  )
}
