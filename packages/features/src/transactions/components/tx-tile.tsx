import { getTxKind } from "@/common/lib/tx"
import { TxIcon } from "@/components/tx-icon"
import type { Mina } from "@palladxyz/mina-core"
import { clsx } from "clsx"
import { Link } from "react-router-dom"

type TxTileProps = {
  tx: Mina.TransactionBody
  currentWalletAddress: string
}

export const TxTile = ({ tx, currentWalletAddress }: TxTileProps) => {
  const kind = getTxKind({ tx, currentWalletAddress })
  return (
    <Link
      key={tx.hash}
      to={`/transactions/${tx.hash}`}
      className={clsx("flex justify-between")}
    >
      <div className="flex space-x-4">
        <div className="w-12 h-12 flex items-center justify-center bg-base-100 rounded-full">
          <TxIcon tx={tx} currentWalletAddress={currentWalletAddress} />
        </div>
        <div>
          {kind === "incoming" && <p>Received</p>}
          {kind === "outgoing" && <p>Sent</p>}
          {kind === "delegation" && <p>Staked</p>}
          <p className="text-[#7D7A9C]">{tx.time}</p>
        </div>
      </div>
      <div className="text-right">
        {kind === "delegation" ? (
          <p>Portfolio</p>
        ) : (
          <p>{`${tx.minaAmount} MINA`}</p>
        )}
        {kind !== "delegation" && (
          <p className="text-[#7D7A9C]">{tx.fiatAmount}</p>
        )}
      </div>
    </Link>
  )
}
