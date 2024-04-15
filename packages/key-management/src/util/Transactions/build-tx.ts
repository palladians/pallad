import { Mina } from '@palladxyz/mina-core'

import { constructTransaction } from './buildMinaTx'

export type constructTxArgs = {
  transaction: Mina.TransactionBody
  transactionKind: Mina.TransactionKind
}

export function constructTx(args: constructTxArgs) {
  return constructTransaction(args.transaction, args.transactionKind)
}
