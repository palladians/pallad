/*

// NOTE: this does not work. experimental only.

import { BorrowedTypes } from "@palladxyz/mina-core"
import { FungibleToken } from "mina-fungible-token"
import { PublicKey, Mina as Chain, UInt64, Transaction } from "o1js"

export type paymentInfo = {
    to: BorrowedTypes.PublicKey
    from: BorrowedTypes.PublicKey
    amount: BorrowedTypes.UInt64
    tokenAddress: BorrowedTypes.PublicKey
    fee: BorrowedTypes.UInt64
}

export async function constructCustomTokenPaymentTx(
    paymentInfo: paymentInfo
  ): Promise<Transaction> {
    const tokenAddress = new PublicKey(paymentInfo.tokenAddress)
    const from = new PublicKey(paymentInfo.from)
    const to = new PublicKey(paymentInfo.to)
    const fee = new UInt64(paymentInfo.fee)
    const amount = new UInt64(paymentInfo.amount)
    await FungibleToken.compile()
    const token = new FungibleToken(tokenAddress)

    const tx = await Chain.transaction({ sender: from, fee }, async () => {
        await token.transfer(from, to, amount)
      })

    return tx
  }

  }*/
