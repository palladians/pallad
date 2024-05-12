import IncomingIcon from "@/common/assets/incoming.svg?react"
import OutgoingIcon from "@/common/assets/outgoing.svg?react"
import StakedIcon from "@/common/assets/staked.svg?react"

const TxIcon = ({
  tx,
  currentWalletAddress,
}: {
  tx: any
  currentWalletAddress: string
}) => {
  if (tx.type === "delegation") {
    return <StakedIcon />
  }
  if (tx.to === currentWalletAddress) {
    return <IncomingIcon />
  }
  return <OutgoingIcon />
}

export const TxTile = ({
  tx,
  currentWalletAddress,
}: {
  tx: any
  currentWalletAddress: string
}) => {
  console.log(">>>TX", tx)
  return (
    <div className="card bg-secondary p-4 aspect-square grid-col gap-1">
      <div className="btn btn-circle bg-neutral">
        <TxIcon tx={tx} currentWalletAddress={currentWalletAddress} />
      </div>
      <h3 className="mt-2">Mina</h3>
      <p>{tx.amount / 1_000_000_000}</p>
    </div>
  )
}
