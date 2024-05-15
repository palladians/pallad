import { Mina } from "@palladxyz/mina-core"
import Client from "mina-signer"
import type {
  Payment,
  SignedLegacy,
} from "mina-signer/dist/node/mina-signer/src/TSTypes"

import { MinaNode } from "../../../../src"

// this util sends Mina on Zeko Dev Net to a known Pallad address that is used in test suites
// if the `submitTx` tests are failing please check if the fee-payer has funds to spend
// when there is no fee payer funds please unskip this test to send funds to the known account
export async function sendMinaOnZeko(nodeUrl: string): Promise<void> {
  const provider = MinaNode.createTxSubmitProvider(nodeUrl)
  const client = new Client({ network: "testnet" })
  const payment = {
    to: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
    from: "B62qoereGLPUg5RWuoTEGu5CSKnN7AAirwwA2h6J1JHH3RF6wbThXmr",
    fee: 2e9,
    nonce: 0,
  }

  const transaction: Mina.TransactionBody = {
    to: payment.to,
    from: payment.from,
    fee: 1 * 1e9,
    amount: 990_000_000_000,
    nonce: Number(0),
    memo: "test suite",
    type: "payment",
    validUntil: 4294967295,
  }

  const signedTx = client.signPayment(
    transaction as Payment,
    "EKDrzVoQTqv6gBrvF81QHYteTYjf4NkzgHbY2JHop4XVH3NbbZWY",
  )

  const submitTxArgs = {
    signedTransaction: signedTx as unknown as SignedLegacy<Payment>, // or SignedLegacy<Common>
    type: Mina.TransactionType.PAYMENT,
    transactionDetails: {
      fee: transaction.fee,
      to: transaction.to,
      from: transaction.from,
      nonce: transaction.nonce,
      memo: transaction.memo,
      amount: transaction.amount,
      validUntil: transaction.validUntil,
    },
  }
  const response = await provider.submitTx(submitTxArgs)
  console.log("Zeko Sequencer Submit Transaction Provider Response", response)
}
