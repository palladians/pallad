import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { useVault } from '@palladxyz/vault'
import { ArrowDownLeftIcon } from 'lucide-react'
import {
  Payment,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'
import { truncateString } from '../../common/lib/string'
import { useTransactionStore } from '../../common/store/transaction'

export const TransactionSummaryView = () => {
  const navigate = useNavigate()
  const sign = useVault((state) => state.sign)
  const submitTx = useVault((state) => state.submitTx)
  const constructTx = useVault((state) => state.constructTx)
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const { publicKey } = useAccount()
  if (!publicKey) return null
  const outgoingTransaction = useTransactionStore(
    (state) => state.outgoingTransaction
  )
  if (!outgoingTransaction) return null
  const total = useMemo(
    () =>
      outgoingTransaction?.amount &&
      outgoingTransaction?.fee &&
      outgoingTransaction?.amount + outgoingTransaction.fee,
    []
  )
  const rawAmount = parseInt(outgoingTransaction.amount || '')
  const rawFee = parseInt(outgoingTransaction.fee || '')
  const amount = BigInt(rawAmount * 1_000_000_000)
  const fee = BigInt(rawFee * 1_000_000_000)
  const constructAndSubmitTx = async () => {
    const transaction: Multichain.MultiChainTransactionBody = {
      to: outgoingTransaction.to,
      from: publicKey,
      fee,
      amount,
      nonce: currentWallet.accountInfo.inferredNonce,
      type: 'payment'
    }
    const constructedTx = await constructTx(
      transaction,
      Mina.TransactionKind.PAYMENT
    )
    const signedTx = await sign(constructedTx as any) // TODO: Fix this with new wallet API
    if (!signedTx) return
    const submitTxArgs = {
      signedTransaction: signedTx as unknown as SignedLegacy<Payment>, // or SignedLegacy<Common>
      kind: Mina.TransactionKind.PAYMENT,
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
    const submittedTx = await submitTx(submitTxArgs as any)
    console.log('>>>ST', submittedTx)
    navigate('/transactions/success')
  }
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-4">
        <ViewHeading
          title="Transaction Summary"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <Card className="flex flex-col relative p-2 gap-2">
          <div className="flex absolute right-4 h-full items-center justify-center text-blue-500">
            <ArrowDownLeftIcon />
          </div>
          <MetaField
            label="From"
            value={
              (publicKey &&
                truncateString({
                  value: publicKey,
                  endCharCount: 8,
                  firstCharCount: 8
                })) ||
              ''
            }
          />
          <MetaField
            label="To"
            value={
              (outgoingTransaction?.to &&
                truncateString({
                  value: outgoingTransaction.to,
                  endCharCount: 8,
                  firstCharCount: 8
                })) ||
              ''
            }
          />
        </Card>
        <Card className="grid grid-cols-2 gap-4 p-2">
          {/*<MetaField label="Kind" value={outgoingTransaction.kind} />*/}
          {outgoingTransaction.amount && (
            <MetaField
              label="Amount"
              value={`${outgoingTransaction.amount} MINA`}
            />
          )}
          <MetaField label="Fee" value={`${outgoingTransaction.fee} MINA`} />
          {outgoingTransaction?.amount && (
            <MetaField label="Total" value={`${total} MINA`} />
          )}
        </Card>
        <div className="flex-1" />
        <Button onClick={constructAndSubmitTx}>Send</Button>
      </div>
    </AppLayout>
  )
}
