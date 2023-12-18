import { zodResolver } from '@hookform/resolvers/zod'
import { GroupedCredentials } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { useVault } from '@palladxyz/vault'
import { addHours } from 'date-fns'
import {
  Payment,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAccount } from '@/common/hooks/useAccount'
import { usePendingTransactionStore } from '@/common/store/pendingTransactions'
import { useTransactionStore } from '@/common/store/transaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ConfirmTransactionSchema } from './ConfirmTransactionForm.schema'

type ConfirmTransactionData = z.infer<typeof ConfirmTransactionSchema>

export const ConfirmTransactionForm = () => {
  const navigate = useNavigate()
  const sign = useVault((state) => state.sign)
  const submitTx = useVault((state) => state.submitTx)
  const constructTx = useVault((state) => state.constructTx)
  const syncWallet = useVault((state) => state._syncWallet)
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const { publicKey } = useAccount()
  const { register, handleSubmit } = useForm<ConfirmTransactionData>({
    resolver: zodResolver(ConfirmTransactionSchema),
    defaultValues: {
      spendingPassword: ''
    }
  })
  const outgoingTransaction = useTransactionStore(
    (state) => state.outgoingTransaction
  )
  const kind = useTransactionStore((state) => state.kind)
  const { addPendingTransaction } = usePendingTransactionStore()
  if (!outgoingTransaction) return null
  const rawAmount = parseInt(outgoingTransaction.amount || '0')
  const rawFee = parseFloat(outgoingTransaction.fee || '0.01')
  const amount = BigInt(rawAmount * 1_000_000_000).toString()
  const fee = BigInt(rawFee * 1_000_000_000).toString()
  const onSubmit: SubmitHandler<ConfirmTransactionData> = async (data) => {
    const transaction: Multichain.MultiChainTransactionBody = {
      to: outgoingTransaction.to,
      from: publicKey,
      memo: outgoingTransaction.memo,
      validUntil: '4294967295',
      fee,
      amount,
      nonce: currentWallet.accountInfo.inferredNonce,
      type: 'payment'
    }
    const constructedTx = await constructTx(
      transaction,
      kind === 'staking'
        ? Mina.TransactionKind.STAKE_DELEGATION
        : Mina.TransactionKind.PAYMENT
    )
    const getPassphrase = async () => Buffer.from(data.spendingPassword)
    const signedTx = await sign(constructedTx as any, getPassphrase)
    if (!signedTx) return
    const submitTxArgs = {
      signedTransaction: signedTx as unknown as SignedLegacy<Payment>,
      kind:
        kind === 'staking'
          ? Mina.TransactionKind.STAKE_DELEGATION
          : Mina.TransactionKind.PAYMENT,
      transactionDetails: {
        fee: transaction.fee,
        to: transaction.to,
        from: transaction.from,
        nonce: transaction.nonce,
        memo: transaction.memo,
        amount: transaction.amount,
        validUntil: transaction.validUntil
      }
    }
    const submittedTx = (await submitTx(submitTxArgs as any)) as any
    addPendingTransaction({
      hash: submittedTx.sendPayment.payment.hash,
      expireAt: addHours(new Date(), 8).toISOString()
    })
    await syncWallet(
      Mina.Networks.DEVNET,
      currentWallet.credential.credential as GroupedCredentials
    )
    navigate('/transactions/success', {
      state: {
        hash: submittedTx.sendPayment.payment.hash
      }
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <Label>Spending Password</Label>
        <Input
          type="password"
          placeholder="Spending Password"
          {...register('spendingPassword')}
          autoFocus
        />
      </fieldset>
      <Button>Send</Button>
    </form>
  )
}
