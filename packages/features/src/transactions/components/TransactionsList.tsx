import { Box, Text } from '@palladxyz/ui'

import { StructurizedTransaction, Transaction } from '../../common/types'
import { structurizeTransactions } from '../utils/structurizeTransactions'
import { TxTile } from './TxTile'

type TxDate = [string, StructurizedTransaction[]]

interface TransactionsListProps {
  transactions: Transaction[]
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  // const walletPublicKey = useVaultStore(
  //   (state) => state.getCurrentWallet()?.walletPublicKey
  // ) as string
  const walletPublicKey = 'B62XXX'
  const txDates: TxDate[] =
    transactions &&
    Object.entries(structurizeTransactions([transactions, walletPublicKey]))
  return txDates?.map(([date, txs]) => (
    <Box key={date} css={{ gap: 16 }}>
      <Text css={{ fontWeight: '600' }}>{date}</Text>
      {txs.map((tx) => (
        <TxTile key={tx.hash} tx={tx} />
      ))}
    </Box>
  ))
}
