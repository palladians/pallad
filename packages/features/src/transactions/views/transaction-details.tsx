import { Mina } from "@palladxyz/mina-core"

import { AppLayout } from "@/components/app-layout"
import { format } from "date-fns"

import { truncateString } from "@/common/lib/string"
import { getTxSide } from "@/common/lib/tx"
import { MenuBar } from "@/components/menu-bar"
import { ArrowRight } from "lucide-react"
type TransactionDetailsViewProps = {
  onGoBack: () => void
  transaction: Mina.TransactionBody
  currentWalletAddress: string
}

export const TransactionDetailsView = ({
  onGoBack,
  transaction,
  currentWalletAddress,
}: TransactionDetailsViewProps) => {
  const side = getTxSide({ tx: transaction, currentWalletAddress })
  return (
    <AppLayout>
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <div className="px-8 pb-6">
        <h2 className="text-3xl mb-6">Transaction detail</h2>
        <div className="space-y-2">
          <div className="py-3 px-4 flex items-center justify-between bg-secondary rounded-2xl">
            <div>
              <p className="text-[#7D7A9C]">From</p>
              <p>
                {truncateString({
                  value: transaction.from,
                  firstCharCount: 5,
                  endCharCount: 3,
                })}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-neutral rounded-full">
              <ArrowRight width={24} height={24} className="text-[#A3DBE4]" />
            </div>
            <div>
              <p className="text-[#7D7A9C]">To</p>
              <p>
                {truncateString({
                  value: transaction.to,
                  firstCharCount: 5,
                  endCharCount: 3,
                })}
              </p>
            </div>
          </div>
          <div className="py-3 px-4 space-y-4 bg-secondary rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">Kind</p>
              <p className="text-right">
                {transaction.type === Mina.TransactionType.PAYMENT
                  ? "Transaction"
                  : "Delegation"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">Type</p>
              <p className="text-right">
                {side === "incoming" ? "Received" : "Sent"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">Amount</p>
              <p className="text-right">{`${transaction.amount} MINA`}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">Date and time</p>
              <p className="text-right">
                {format(
                  new Date(transaction.dateTime ?? ""),
                  "dd/MM/yy - HH:mm",
                )}
              </p>
            </div>
            <hr className="border-[#413E5E]" />
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">Hash</p>
              <p className="w-32 break-all text-right">{transaction.hash}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
