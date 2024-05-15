import { formatCompact } from "@/common/lib/numbers"
import { TxIcon } from "@/components/tx-icon"

export const TxTile = ({
  tx,
  currentWalletAddress,
}: {
  tx: any
  currentWalletAddress: string
}) => {
  const formattedAmount = formatCompact({ value: tx.amount })
  return (
    <div className="card bg-secondary p-4 aspect-square grid-col gap-1">
      <div className="btn btn-circle bg-neutral">
        <TxIcon tx={tx} currentWalletAddress={currentWalletAddress} />
      </div>
      <h3 className="mt-2">Mina</h3>
      <p>{formattedAmount}</p>
    </div>
  )
}
