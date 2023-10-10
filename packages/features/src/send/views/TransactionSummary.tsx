import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { Button, Card } from '@palladxyz/ui'
import { ArrowDownLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWalletUi } from '../../common/hooks/useWalletUi'
import { truncateString } from '../../common/lib/string'
import { useTransactionStore } from '../../common/store/transaction'

export const TransactionSummaryView = () => {
  const navigate = useNavigate()
  const { sign, submitTx, constructTx, credentialAddress } = useWalletUi()
  if (!credentialAddress) return null
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
      from: credentialAddress,
      fee,
      amount,
      nonce: 0, // TODO: nonce management -- should we have a Nonce Manager in the wallet? Yes.
      type: 'payment' // TODO: handle with enums (payment, delegation, zkApp commands?)
    }
    const constructedTx = await constructTx(
      transaction,
      Mina.TransactionKind.PAYMENT
    )
    const signedTx = await sign(constructedTx) // TODO: Fix this with new wallet API
    if (!signedTx) return
    const submittedTx = await submitTx(signedTx as any)
    console.log('>>>ST', submittedTx?.result)
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
              (credentialAddress &&
                truncateString({
                  value: credentialAddress,
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
