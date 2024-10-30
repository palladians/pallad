import type { BorrowedTypes, Mina } from "@palladxyz/mina-core"

import type { Provider } from "../provider"

export type SubmitTxArgs = {
  signedTransaction:
    | BorrowedTypes.SignedLegacy<BorrowedTypes.Payment>
    | BorrowedTypes.SignedLegacy<BorrowedTypes.StakeDelegation>
  type: Mina.TransactionType
}

interface TxResult {
  id: string
  hash: string
  type: string
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
