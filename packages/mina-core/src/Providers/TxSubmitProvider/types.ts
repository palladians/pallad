import { BorrowedTypes } from '../../'
import { TransactionBody, TransactionKind } from '../../Mina'
import { Provider } from '../Provider'

export type SubmitTxArgs = {
  signedTransaction:
    | BorrowedTypes.SignedLegacy<BorrowedTypes.Payment>
    | BorrowedTypes.SignedLegacy<BorrowedTypes.StakeDelegation>
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

export interface SubmitPaymentResult {
  sendPayment: {
    payment: TxResult
  }
}

export interface SubmitDelegationResult {
  sendDelegation: {
    delegation: TxResult
  }
}

export interface SubmitTxResult {
  result: SubmitPaymentResult | SubmitDelegationResult
}

export interface TxSubmitProvider extends Provider {
  /**
   * Submits a signed transaction to the network.
   * @param args The signed transaction to submit.
   * @throws Will throw an error if the transaction submission fails.
   **/
  submitTx: (args: SubmitTxArgs) => Promise<SubmitTxResult>
}
