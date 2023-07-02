import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { Transaction, TransactionKind } from '../../Mina'
import { Provider } from '../Provider'

export type SubmitTxArgs = {
  signedTransaction:
    | SignedLegacy<Json.Payment>
    | SignedLegacy<Json.StakeDelegation>
  kind: TransactionKind
  transactionDetails: {
    fee: Transaction['fee']
    to: Transaction['to']
    from: Transaction['from']
    nonce: Transaction['nonce']
    memo: Transaction['memo']
    validUntil: Transaction['validUntil']
    amount: Transaction['amount']
  }
}

export interface TxSubmitProvider extends Provider {
  /**
   * Submits a signed transaction to the network.
   * @param args The signed transaction to submit.
   * @throws Will throw an error if the transaction submission fails.
   **/
  submitTx: (args: SubmitTxArgs) => Promise<void>
}
