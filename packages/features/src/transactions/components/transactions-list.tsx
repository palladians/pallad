import { Multichain } from '@palladxyz/multi-chain-core'

import { useAccount } from '@/common/hooks/use-account'

import { structurizeTransactions } from '../utils/structurize-transactions'
import { TxTile } from './tx-tile'

interface TransactionsListProps {
  // TODO: Refactor to not use multichain package and use new signing args
  transactions: Multichain.MultiChainTransactionBody[]
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const { publicKey } = useAccount()
  if (!publicKey) return null
  const txDates =
    transactions &&
    Object.entries(structurizeTransactions([transactions, publicKey]))
  return (
    <div className="flex flex-col gap-4">
      {txDates?.map(([date, txs]) => (
        <div className="flex flex-col gap-2" key={date}>
          <div className="font-semibold">{date}</div>
          <div className="flex flex-col gap-2">
            {txs.map((tx) => (
              <TxTile key={tx.hash} tx={tx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
