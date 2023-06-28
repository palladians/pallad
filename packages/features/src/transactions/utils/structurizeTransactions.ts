import dayjs from 'dayjs'
import { groupBy, map, pipe } from 'rambda'

import { Transaction, TxSide } from '../../common/types'

export const structurizeTransactions = ([txs, walletPublicKey]: [
  Transaction[],
  string
]) =>
  pipe(
    map((tx: Transaction) => ({
      ...tx,
      date:
        dayjs().diff(tx.dateTime, 'days') < 2
          ? dayjs(tx.dateTime).fromNow()
          : dayjs(tx.dateTime).format('DD MMM YYYY'),
      time: dayjs(tx.dateTime).format('HH:mm'),
      minaAmount: tx.amount / 1_000_000_000,
      side: tx.from === walletPublicKey ? TxSide.OUTGOING : TxSide.INCOMING
    })),
    groupBy((tx) => tx.date)
  )(txs)
