import { Mina } from '@palladxyz/mina-core'
import { Button, Card } from '@palladxyz/ui'
import { ArrowDownLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { truncateString } from '../../common/lib/string'
import { useWallet } from '../../wallet/hooks/useWallet'
import { useTransactionStore } from '../../wallet/store/transaction'

export const TransactionSummaryView = () => {
  const navigate = useNavigate()
  const { wallet } = useWallet()
  const outgoingTransaction = useTransactionStore(
    (state) => state.outgoingTransaction
  )
  const { address } = useWallet()
  const total = useMemo(
    () =>
      outgoingTransaction.amount &&
      outgoingTransaction.fee &&
      outgoingTransaction.amount + outgoingTransaction.fee,
    []
  )
  const amount = BigInt(outgoingTransaction.amount * 1_000_000_000)
  const fee = BigInt(outgoingTransaction.fee * 1_000_000_000)
  const constructAndSubmitTx = async () => {
    const transaction: Mina.TransactionBody = {
      to: outgoingTransaction.to,
      from: address,
      fee,
      amount,
      nonce: 0,
      type: 'payment'
    }
    const constructedTx = await wallet.constructTx(
      transaction,
      Mina.TransactionKind.PAYMENT
    )
    const signedTx = await wallet.sign(constructedTx)
    const submittedTx = await wallet.submitTx(signedTx)
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
              (address &&
                truncateString({
                  value: address,
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
          <MetaField label="Kind" value={outgoingTransaction.kind} />
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
