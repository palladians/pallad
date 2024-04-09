import { Mina } from '@palladxyz/mina-core'
import dayjs from 'dayjs'
import { groupBy, map, pipe } from 'rambda'

import { TxSide } from '@/common/types'

const dateFromNow = ({ dateTime }: { dateTime: string }) =>
  dayjs().diff(dateTime, 'days') < 2
    ? dayjs(dateTime).fromNow()
    : dayjs(dateTime).format('DD MMM YYYY')

export const structurizeTransaction = ({
  tx,
  walletPublicKey
}: {
  tx: Mina.TransactionBody
  walletPublicKey: string
}) => ({
  ...tx,
  date: dateFromNow({ dateTime: tx.dateTime! }),
  time: dayjs(tx.dateTime).format('HH:mm'),
  minaAmount: (Number(tx.amount) / 1_000_000_000).toFixed(3),
  minaFee: (Number(tx.fee) / 1_000_000_000).toFixed(3),
  txTotalMinaAmount: (
    (Number(tx.amount) + Number(tx.fee)) /
    1_000_000_000
  ).toFixed(3),
  side: tx.from === walletPublicKey ? TxSide.OUTGOING : TxSide.INCOMING
})

export const structurizeTransactions = ([txs, walletPublicKey]: [
  Mina.TransactionBody[],
  string
]) =>
  pipe(
    map((tx: Mina.TransactionBody) =>
      structurizeTransaction({ tx, walletPublicKey })
    ),
    groupBy((tx) => tx.date)
  )(txs)
