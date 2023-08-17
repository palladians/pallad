import { Mina } from '@palladxyz/mina-core'
import { ArrowDownLeftIcon, ArrowUpRightIcon, CoinsIcon } from 'lucide-react'

import { TxSide } from '../../common/types'

interface TxSideIndicatorProps {
  side: TxSide
  kind: Mina.TransactionKind
}

export const TxIndicator = ({ kind, side }: TxSideIndicatorProps) => {
  return (
    <div className="flex rounded-full dark:bg-blue-900 bg-blue-300 dark:text-blue-300 text-blue-900 w-10 h-10 justify-center items-center">
      {kind === 'payment'.toUpperCase() ? (
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
