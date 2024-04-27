import type { Mina } from "@palladxyz/mina-core"

import type { TxSide } from "@/common/types"
import { AppLayout } from "@/components/app-layout"
import { MetaField } from "@/components/meta-field"
import { ViewHeading } from "@/components/view-heading"
import { getAccountUrl, getTransactionUrl } from "@/lib/explorer"

import { TxIndicator } from "../components/tx-indicator"

type TransactionData = {
  side: TxSide
  kind?: Mina.TransactionKind
  minaAmount: string
  hash: string
  from: string
  to: string
  dateTime: string
}

type TransactionDetailsView = {
  onGoBack: () => void
  loading: boolean
  transaction: TransactionData
  network: string
}

export const TransactionDetailsView = ({
  onGoBack,
  loading,
  transaction,
  network,
}: TransactionDetailsView) => {
  const transactionMetaFields = transaction && [
    {
      label: "Hash",
      value: transaction.hash,
      url: getTransactionUrl({ network, hash: transaction.hash }),
    },
    { label: "Amount", value: `${transaction.minaAmount} MINA` },
    {
      label: "Sender",
      value: transaction.from,
      url: getAccountUrl({ network, publicKey: transaction.from }),
    },
    {
      label: "Receiver",
      value: transaction.to,
      url: getAccountUrl({ network, publicKey: transaction.to }),
    },
  ]
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Transaction Details"
          backButton={{ onClick: onGoBack }}
        />
        <div className="flex flex-col gap-4 p-4">
          {loading ? (
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
