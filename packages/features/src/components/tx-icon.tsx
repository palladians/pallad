import IncomingIcon from "@/common/assets/incoming.svg?react"
import OutgoingIcon from "@/common/assets/outgoing.svg?react"
import StakedIcon from "@/common/assets/staked.svg?react"
import { getTxKind } from "@/common/lib/tx"

export const TxIcon = ({
  tx,
  currentWalletAddress,
}: {
  tx: any
  currentWalletAddress: string
}) => {
  const kind = getTxKind({ tx, currentWalletAddress })
  if (kind === "delegation") {
    return <StakedIcon />
  }
  if (kind === "incoming") {
    return <IncomingIcon />
  }
  return <OutgoingIcon />
}
