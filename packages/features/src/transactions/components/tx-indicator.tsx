import { Mina } from "@palladxyz/mina-core"
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BeefIcon,
  CoinsIcon,
  RepeatIcon,
} from "lucide-react"

import { TxSide } from "@/common/types"

interface TxSideIndicatorProps {
  side: TxSide
  kind: Mina.TransactionKind
  from: string
  to: string
}

export const TxIndicator = ({ kind, side, from, to }: TxSideIndicatorProps) => {
  const isSentToSelf = from === to

  let icon

  if (kind === Mina.TransactionKind.PAYMENT) {
    if (isSentToSelf) {
      icon = <RepeatIcon />
    } else {
      icon =
        side === TxSide.INCOMING ? <ArrowDownLeftIcon /> : <ArrowUpRightIcon />
    }
  } else if (kind === Mina.TransactionKind.STAKE_DELEGATION) {
    icon = <BeefIcon />
  } else {
    icon = <CoinsIcon />
  }
  return (
    <div className="flex rounded-full dark:bg-blue-900 bg-blue-300 dark:text-blue-300 text-blue-900 w-10 h-10 justify-center items-center">
      {icon}
    </div>
  )
}
