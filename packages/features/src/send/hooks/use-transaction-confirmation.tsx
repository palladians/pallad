import type { ChainOperationArgs } from "@palladxyz/key-management"
import { TransactionType } from "@palladxyz/mina-core"
import { useVault } from "@palladxyz/vault"
import dayjs from "dayjs"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import type { z } from "zod"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactionStore } from "@/common/store/transaction"
import { usePendingTransactionStore } from "@palladxyz/vault"

import type { SignedTransaction, TransactionBody } from "@mina-js/utils"
import { utf8ToBytes } from "@noble/hashes/utils"
import type { ConfirmTransactionSchema } from "../components/confirm-transaction-form.schema"

type ConfirmTransactionData = z.infer<typeof ConfirmTransactionSchema>

type UseTransactionConfirmationProps = {
  confirmationForm: UseFormReturn<{ spendingPassword: string }>
}

export const useTransactionConfirmation = ({
  confirmationForm,
}: UseTransactionConfirmationProps) => {
  const navigate = useNavigate()
  const sign = useVault((state) => state.sign)
  const submitTx = useVault((state) => state.submitTx)
  const constructTx = useVault((state) => state.constructTx)
  const syncWallet = useVault((state) => state._syncWallet)
  const currentNetworkId = useVault((state) => state.currentNetworkId)
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
  const rawTransaction = {
    to: outgoingTransaction.to,
    from: publicKey,
    memo: outgoingTransaction.memo,
    validUntil: "4294967295",
    fee,
    amount,
    nonce: accountProperties?.inferredNonce ?? 0, // need a util for this whole `onSubmit` to remove Mina dependency
  }
  const submitTransaction: SubmitHandler<ConfirmTransactionData> = async (
    data,
  ) => {
    const constructedTx = constructTx({ transaction: rawTransaction })
    const getPassphrase = () => utf8ToBytes(data.spendingPassword)
    let signedTx
    // TODO: make chain agnostic depending on the currentWallet chain and it's corresponding operation e.g. 'eth_signTransaction' vs 'mina_signTransaction'
    const operationArgs: ChainOperationArgs = {
      operation: "mina_signTransaction",
      network: "Mina",
      networkType: currentNetworkId === "mina:mainnet" ? "mainnet" : "testnet",
    }
    let txBody: TransactionBody
    if (type === TransactionType.STAKE_DELEGATION) {
      const { amount, ...txRest } = constructedTx
      txBody = txRest
    } else {
      txBody = constructedTx
    }
    try {
      signedTx = (await sign(
        { transaction: txBody },
        operationArgs,
        getPassphrase,
      )) as SignedTransaction
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AuthenticationError")
          confirmationForm.setError("spendingPassword", {
            type: "wrongPassword",
            message: "The spending password is wrong",
          })
      }
    }
    const submitTxArgs = {
      signedTransaction: signedTx,
      type,
    }
    const hash = await submitTx(submitTxArgs as never)
    addPendingTransaction({
      hash,
      expireAt: dayjs().add(8, "hours").toISOString(),
    })
    await syncWallet()
    navigate("/transactions/success", {
      state: {
        hash,
      },
    })
  }
  return { submitTransaction }
}
