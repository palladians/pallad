import { formatCompact } from "@/common/lib/numbers"
import { TxIcon } from "@/components/tx-icon"
import { Link } from "react-router-dom"

export const TxTile = ({
  tx,
  currentWalletAddress,
}: {
  tx: any
  currentWalletAddress: string
}) => {
  const formattedAmount = formatCompact({ value: tx.amount })
  return (
    <Link
      to={`/transactions/${tx.hash}`}
      className="[&:nth-child(3)]:hidden sm:[&:nth-child(3)]:flex"
    >
      <div className="card bg-secondary p-4 aspect-square grid-col gap-1 justify-between">
        <div className="btn btn-circle bg-neutral">
          <TxIcon tx={tx} currentWalletAddress={currentWalletAddress} />
        </div>
        <div className="flex flex-col">
          <h3 className="mt-2">Mina</h3>
          <p>{formattedAmount}</p>
        </div>
      </div>
    </Link>
  )
}
