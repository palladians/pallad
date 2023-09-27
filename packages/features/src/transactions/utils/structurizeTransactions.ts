import { Multichain } from '@palladxyz/multi-chain-core'
import dayjs from 'dayjs'
import { groupBy, map, pipe } from 'rambda'

import { TxSide } from '../../common/types'

const dateFromNow = ({ dateTime }: { dateTime: string }) =>
  dayjs().diff(dateTime, 'days') < 2
    ? dayjs(dateTime).fromNow()
    : dayjs(dateTime).format('DD MMM YYYY')

export const structurizeTransaction = ({
  tx,
  walletPublicKey
}: {
  tx: Multichain.MultiChainTransactionBody
  walletPublicKey: string
}) => ({
  ...tx,
  date: dateFromNow({ dateTime: tx.dateTime! }),
  time: dayjs(tx.dateTime).format('HH:mm'),
  minaAmount: tx.amount / 1_000_000_000,
  side: tx.from === walletPublicKey ? TxSide.OUTGOING : TxSide.INCOMING
})

export const structurizeTransactions = ([txs, walletPublicKey]: [
  Multichain.MultiChainTransactionBody[],
  string
]) =>
  pipe(
    map((tx: Multichain.MultiChainTransactionBody) =>
      structurizeTransaction({ tx, walletPublicKey })
    ),
    groupBy((tx) => tx.date)
  )(txs)
