import { useNavigate, useParams } from 'react-router-dom'

import { useAccount } from '@/common/hooks/use-account'
import { useTransaction } from '@/common/hooks/use-transaction'
import { AppLayout } from '@/components/app-layout'
import { MetaField } from '@/components/meta-field'
import { Skeleton } from '@/components/ui/skeleton'
import { ViewHeading } from '@/components/view-heading'
import { getAccountUrl, getTransactionUrl } from '@/lib/explorer'

import { TxIndicator } from '../components/tx-indicator'
import { structurizeTransaction } from '../utils/structurize-transactions'

export const TransactionDetailsView = () => {
  const { publicKey, network } = useAccount()
  const navigate = useNavigate()
  const { hash } = useParams()
  if (!hash) return null
  if (!publicKey) return null
  const {
    data: transactionData,
    isLoading: transactionLoading,
    error
  } = useTransaction({ hash })
  const transaction =
    transactionData &&
    structurizeTransaction({
      tx: transactionData as any,
      walletPublicKey: publicKey
    })
  console.log('>>>TXD', transactionData, error)
  const transactionMetaFields = transaction && [
    {
      label: 'Hash',
      value: transaction.hash,
      url: getTransactionUrl({ network, hash })
    },
    { label: 'Amount', value: `${transaction.minaAmount} MINA` },
    {
      label: 'Sender',
      value: transaction.from,
      url: getAccountUrl({ network, publicKey: transaction.from })
    },
    {
      label: 'Receiver',
      value: transaction.to,
      url: getAccountUrl({ network, publicKey: transaction.to })
    }
  ]
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Transaction Details"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col gap-4 p-4">
          {transactionLoading ? (
            <Skeleton className="w-full h-8" />
          ) : (
            transaction && (
              <div className="flex items-center gap-4">
                {transaction.kind && (
                  <TxIndicator
                    side={transaction.side}
                    kind={transaction.kind}
                    from={transaction.from}
                    to={transaction.to}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <p>{transaction.dateTime}</p>
                  <p>Incoming</p>
                </div>
              </div>
            )
          )}
          {transactionMetaFields?.map(({ label, value, url }) => (
            <MetaField
              key={label}
              label={label}
              value={value as any}
              url={url}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
