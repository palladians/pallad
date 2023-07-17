import { Button, Card, Label } from '@palladxyz/ui'
import { ArrowDownLeftIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
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
      <div className="flex flex-1 flex-col gap-4">
        <ViewHeading
          title="Transaction Summary"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <Card className="flex flex-col p-2 gap-2">
          <div className="absolute right-4 top-35/100">
            <ArrowDownLeftIcon />
          </div>
          <div className="flex flex-col gap-2">
            <Label>From</Label>
            <div>
              {walletPublicKey &&
                truncateString({
                  value: walletPublicKey,
                  endCharCount: 8,
                  firstCharCount: 8
                })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>To</Label>
            <div>
              {outgoingTransaction?.to &&
                truncateString({
                  value: outgoingTransaction.to,
                  endCharCount: 8,
                  firstCharCount: 8
                })}
            </div>
          </div>
        </Card>
        <div className=" flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <Label>Kind</Label>
            <div className="capitalize">{outgoingTransaction.kind}</div>
          </div>
          {outgoingTransaction?.amount && (
            <div className="flex flex-col gap-2">
              <Label>Amount</Label>
              <div>{outgoingTransaction.amount} MINA</div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Fee</Label>
            <div>{outgoingTransaction.fee} MINA</div>
          </div>
          {outgoingTransaction?.amount && (
            <div className="flex flex-col gap-2">
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
