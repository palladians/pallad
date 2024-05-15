import type { ChainOperationArgs } from "@palladxyz/key-management"
import { Mina } from "@palladxyz/mina-core"
import { useVault } from "@palladxyz/vault"
import { addHours } from "date-fns"
import type {
  Payment,
  SignedLegacy,
} from "mina-signer/dist/node/mina-signer/src/TSTypes"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useMixpanel } from "react-mixpanel-browser"
import { useNavigate } from "react-router-dom"
import type { z } from "zod"

import { useAccount } from "@/common/hooks/use-account"
import { usePendingTransactionStore } from "@/common/store/pending-transactions"
import { useTransactionStore } from "@/common/store/transaction"

import type { ConfirmTransactionSchema } from "../components/confirm-transaction-form.schema"

type ConfirmTransactionData = z.infer<typeof ConfirmTransactionSchema>

type UseTransactionConfirmationProps = {
  confirmationForm: UseFormReturn<{ spendingPassword: string }>
}

export const useTransactionConfirmation = ({
  confirmationForm,
}: UseTransactionConfirmationProps) => {
  const mixpanel = useMixpanel()
  const navigate = useNavigate()
  // can use
  // const request = useVault((state) => state.request) for signing
  const sign = useVault((state) => state.sign)
  const submitTx = useVault((state) => state.submitTx)
  const constructTx = useVault((state) => state.constructTx)
  const syncWallet = useVault((state) => state._syncWallet)
  //const currentWallet = useVault((state) => state.getCurrentWallet())
  const { publicKey, data: accountProperties } = useAccount()
  const outgoingTransaction = useTransactionStore(
    (state) => state.outgoingTransaction,
  )
  const type = useTransactionStore((state) => state.type)
  const { addPendingTransaction } = usePendingTransactionStore()
  if (!outgoingTransaction) throw new Error("Missing outgoing tx")
  const rawAmount = outgoingTransaction.amount || 0
  const rawFee = outgoingTransaction.fee || 0.001
  const amount = BigInt(rawAmount * 1_000_000_000).toString()
  const fee = BigInt(rawFee * 1_000_000_000).toString()
  const rawTransaction: Mina.TransactionBody = {
    to: outgoingTransaction.to,
    from: publicKey,
    memo: outgoingTransaction.memo,
    validUntil: "4294967295",
    fee,
    amount,
    nonce: accountProperties?.inferredNonce ?? 0, // need a util for this whole `onSubmit` to remove Mina dependency
    type,
  }
  const constructTransaction = () => {
    const constructTxArgs = {
      transaction: rawTransaction,
      transactionType: type,
    }
    return constructTx(constructTxArgs)
  }
  const submitTransaction: SubmitHandler<ConfirmTransactionData> = async (
    data,
  ) => {
    const constructedTx = await constructTransaction()
    const getPassphrase = () =>
      new Promise<Uint8Array>((resolve) =>
        resolve(Buffer.from(data.spendingPassword)),
      )
    let signedTx
    // TODO: make chain agnostic depending on the currentWallet chain and it's corresponding operation e.g. 'eth_signTransaction' vs 'mina_signTransaction'
    const operationArgs: ChainOperationArgs = {
      operation: "mina_signTransaction",
      network: "Mina",
      networkType: "testnet", // TODO: make configurable for 'mainnet' and 'testnet'
    }
    try {
      signedTx = await sign(constructedTx as any, operationArgs, getPassphrase)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AuthenticationError")
          confirmationForm.setError("spendingPassword", {
            type: "wrongPassword",
            message: "The spending password is wrong",
          })
      }
    }
    // TODO: Make a util for this
    const submitTxArgs = {
      signedTransaction: signedTx as unknown as SignedLegacy<Payment>,
      type,
      transactionDetails: {
        fee: rawTransaction.fee,
        to: rawTransaction.to,
        from: rawTransaction.from,
        nonce: rawTransaction.nonce,
        memo: rawTransaction.memo,
        amount: rawTransaction.amount,
        validUntil: rawTransaction.validUntil,
      },
    }
    const submittedTx = (await submitTx(submitTxArgs as any)) as any
    const hash =
      submittedTx?.sendPayment?.payment?.hash ??
      submittedTx?.sendDelegation?.delegation?.hash
    addPendingTransaction({
      hash,
      expireAt: addHours(new Date(), 8).toISOString(),
    })
    await syncWallet()
    mixpanel.track(
      type === Mina.TransactionType.STAKE_DELEGATION
        ? "PortfolioDelegated"
        : "TransactionSent",
      {
        amount: rawTransaction.amount,
        fee: rawTransaction.fee,
        to: type === Mina.TransactionType.STAKE_DELEGATION && rawTransaction.to,
      },
    )
    navigate("/transactions/success", {
      state: {
        hash,
      },
    })
  }
  return { submitTransaction }
}
