import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { TransactionBody, TransactionKind } from '../../Mina'
import { Provider } from '../Provider'

export type SubmitTxArgs = {
  signedTransaction:
    | SignedLegacy<Json.Payment>
    | SignedLegacy<Json.StakeDelegation>
  kind: TransactionKind
  transactionDetails: {
    fee: TransactionBody['fee']
    to: TransactionBody['to']
    from: TransactionBody['from']
    nonce: TransactionBody['nonce']
    memo: TransactionBody['memo']
    validUntil: TransactionBody['validUntil']
    amount: TransactionBody['amount']
  }
}

export interface TxResult {
  amount: string
  fee: string
  feeToken: string
  from: string
  hash: string
  id: string
  isDelegation: boolean
  memo: string
  nonce: number
  kind: string
  to: string
}

export interface SendPaymentResult {
  sendPayment: {
    payment: TxResult
  }
}

export interface SendDelegationResult {
  sendDelegation: {
    delegation: TxResult
  }
}

export interface SendTxResult {
  result: SendPaymentResult | SendDelegationResult
}

export interface TxSubmitProvider extends Provider {
  /**
   * Submits a signed transaction to the network.
   * @param args The signed transaction to submit.
   * @throws Will throw an error if the transaction submission fails.
   **/
  submitTx: (args: SubmitTxArgs) => Promise<SendTxResult>
}
