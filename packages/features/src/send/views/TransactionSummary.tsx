import { Button, Card, Label } from '@palladxyz/ui'
import { ArrowDownLeftIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { truncateString } from '../../common/lib/string'
// import { useTransactionStore } from '../../common/store/transaction'
// import { useVaultStore } from '../../common/store/vault'

export const TransactionSummaryView = () => {
  const navigate = useNavigate()
  // const outgoingTransaction = useTransactionStore(
  //   (state) => state.outgoingTransaction
  // )
  const outgoingTransaction = {}
  // const walletPublicKey = useVaultStore(
  //   (state) => state.getCurrentWallet()?.walletPublicKey
  // )
  const walletPublicKey = 'B62XXX'
  return (
    <AppLayout>
      <div className="p-4 gap-4 flex-1">
        <ViewHeading
          title="Transaction Summary"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <Card>
          <div className="absolute right-4 top-35/100">
            <ArrowDownLeftIcon />
          </div>
          <div className="gap-2">
            <FormLabel>From</FormLabel>
            <div>
              {walletPublicKey &&
                truncateString({
                  value: walletPublicKey,
                  endCharCount: 8,
                  firstCharCount: 8
                })}
            </div>
          </div>
          <div className="gap-2">
            <FormLabel>To</FormLabel>
            <div>
              {truncateString({
                value: outgoingTransaction.to,
                endCharCount: 8,
                firstCharCount: 8
              })}
            </div>
          </div>
        </Card>
        <div className="gap-4 flex-1">
          <div className="gap-1">
            <FormLabel>Kind</FormLabel>
            <div className="capitalize">{outgoingTransaction.kind}</div>
          </div>
          {outgoingTransaction?.amount && (
            <div className="gap-1">
              <Label>Amount</Label>
              <div>{outgoingTransaction.amount} MINA</div>
            </div>
          )}
          <div className="gap-1">
            <FormLabel>Fee</FormLabel>
            <div>{outgoingTransaction.fee} MINA</div>
          </div>
          {outgoingTransaction?.amount && (
            <div className="gap-1">
              <Label>Total</Label>
              <div>15.2 MINA</div>
            </div>
          )}
        </div>
        <Button onClick={() => navigate('/transactions/success')}>Send</Button>
      </div>
    </AppLayout>
  )
}
