import type { Mina } from "@palladxyz/mina-core"

import { constructTransaction } from "./build-mina-tx"

// high-level Mina constructTx API
export type constructTxArgs = {
  transaction: Mina.TransactionBody
  transactionType: Mina.TransactionType
}

export function constructTx(args: constructTxArgs) {
  /*
    TODO: there are three kinds of transactionType:
    // from mina-core
        export enum TransactionType {
          PAYMENT = 'payment',
          STAKE_DELEGATION = 'delegation',
          ZK_APP = 'zkApp'
          // Add other kinds of transactions as needed
        }

    we need to consider the case where this is a custom token spend (i.e. ZK_APP kind) too.
    */
  return constructTransaction(args.transaction, args.transactionType)
}
