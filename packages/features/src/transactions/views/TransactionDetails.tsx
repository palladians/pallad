import { useNavigate, useParams } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import { getAccountUrl, getTransactionUrl } from '@/lib/explorer'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'
import { useTransaction } from '../../common/hooks/useTransaction'
import { TxIndicator } from '../components/TxIndicator'
import { structurizeTransaction } from '../utils/structurizeTransactions'

export const TransactionDetailsView = () => {
  const { publicKey, network } = useAccount()
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
