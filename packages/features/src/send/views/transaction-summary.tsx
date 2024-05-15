import { ArrowRightIcon } from "lucide-react"

import { truncateString } from "@/common/lib/string"
import { AppLayout } from "@/components/app-layout"

import { MenuBar } from "@/components/menu-bar"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { ConfirmTransactionForm } from "../components/confirm-transaction-form"

type TransactionSummaryViewProps = {
  transaction: {
    from: string
    to: string
    amount: number
    fee: number
    type: string
    total: number
  }
  confirmationForm: UseFormReturn<{ spendingPassword: string }>
  submitTransaction: SubmitHandler<any>
}

export const TransactionSummaryView = ({
  transaction,
  confirmationForm,
  submitTransaction,
}: TransactionSummaryViewProps) => {
  return (
    <AppLayout>
      <MenuBar variant="back-stop" />
      <div className="flex flex-1 flex-col px-8 pb-8 gap-2">
        <h1 className="text-3xl">Summary</h1>
        <div className="card bg-secondary py-3 px-4 flex flex-row justify-between mt-1">
          <div className="flex flex-col">
            <div className="text-[#7D7A9C]">From</div>
            <div>
              {truncateString({
                value: transaction.from,
                endCharCount: 3,
                firstCharCount: 5,
              })}
            </div>
          </div>
          <div className="btn btn-circle btn-neutral text-mint">
            <ArrowRightIcon size={24} />
          </div>
          <div className="flex flex-col">
            <div className="text-[#7D7A9C]">From</div>
            <div>
              {truncateString({
                value: transaction.to,
                endCharCount: 3,
                firstCharCount: 5,
              })}
            </div>
          </div>
        </div>
        <div className="card bg-secondary px-4 py-2 grid grid-cols-2">
          <div className="text-[#7D7A9C] py-2">Kind</div>
          <div className="capitalize text-right py-2">{transaction.type}</div>
          {transaction.type !== "delegation" && (
            <>
              <div className="text-[#7D7A9C] py-2">Amount</div>
              <div className="capitalize text-right py-2">
                {transaction.amount} MINA
              </div>
            </>
          )}
          <div className="text-[#7D7A9C] py-2">Fee</div>
          <div className="capitalize text-right py-2">
            {transaction.fee} MINA
          </div>
          <div className="divider col-span-2 my-0" />
          <div className="text-[#7D7A9C] py-2">Total</div>
          <div className="capitalize text-right py-2">
            {transaction.total} MINA
          </div>
        </div>
        <ConfirmTransactionForm
          confirmationForm={confirmationForm}
          submitTransaction={submitTransaction}
        />
      </div>
    </AppLayout>
  )
}
