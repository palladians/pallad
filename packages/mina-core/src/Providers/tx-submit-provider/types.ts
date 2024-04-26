import type { BorrowedTypes } from "../.."
import type { TransactionBody, TransactionKind } from "../../Mina"
import type { Provider } from "../Provider"

export type SubmitTxArgs = {
  signedTransaction:
    | BorrowedTypes.SignedLegacy<BorrowedTypes.Payment>
    | BorrowedTypes.SignedLegacy<BorrowedTypes.StakeDelegation>
  kind: TransactionKind
  transactionDetails: {
    fee: TransactionBody["fee"]
    to: TransactionBody["to"]
    from: TransactionBody["from"]
    nonce: TransactionBody["nonce"]
    memo: TransactionBody["memo"]
    validUntil: TransactionBody["validUntil"]
    amount: TransactionBody["amount"]
  }
}

interface TxResult {
  id: string
  hash: string
  kind: string
  nonce: number
  source: {
    publicKey: string
  }
  receiver: {
    publicKey: string
  }
  feePayer: {
    publicKey: string
  }
  validUntil: string
  token: string
  amount: string
  feeToken: string
  fee: string
  memo: string
  __typename: string
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
