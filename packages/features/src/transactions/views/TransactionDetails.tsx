import { useNavigate, useParams } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'
import { useTransaction } from '../../common/hooks/useTransaction'
import { TxIndicator } from '../components/TxIndicator'
import { structurizeTransaction } from '../utils/structurizeTransactions'

export const TransactionDetailsView = () => {
  const { publicKey } = useAccount()
  const navigate = useNavigate()
  const { hash } = useParams()
  if (!hash) return null
  if (!publicKey) return null
  const { data: transactionData, isLoading: transactionLoading } =
    useTransaction({ hash })
  const transaction =
    transactionData &&
    structurizeTransaction({
      tx: transactionData as any,
      walletPublicKey: publicKey
    })
  const transactionMetaFields = transaction && [
    { label: 'Hash', value: transaction.hash },
    // TODO: Figure out how to make the amount not only MINA
    { label: 'Amount', value: `${transaction.minaAmount} MINA` },
    { label: 'Sender', value: transaction.from },
    { label: 'Receiver', value: transaction.to }
  ]
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title="Transaction Details"
          backButton={{ onClick: () => navigate(-1) }}
        />
        {transactionLoading ? (
          <Skeleton className="w-full h-8" />
        ) : (
          <div className="flex flex-col gap-4">
            {transaction && (
              <div className="flex items-center gap-4">
                {transaction.kind && (
                  <TxIndicator
                    side={transaction.side}
                    kind={transaction.kind}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <p>{transaction.dateTime}</p>
                  <p>Incoming</p>
                </div>
              </div>
            )}
            {transactionMetaFields?.map(({ label, value }) => (
              <MetaField key={label} label={label} value={value as any} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
