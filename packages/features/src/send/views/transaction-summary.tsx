import { AppLayout } from "@/components/app-layout"

import { FromTo } from "@/components/from-to"
import { MenuBar } from "@/components/menu-bar"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
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
  onGoBack: () => void
  onClose: () => void
}

export const TransactionSummaryView = ({
  transaction,
  confirmationForm,
  submitTransaction,
  onGoBack,
  onClose,
}: TransactionSummaryViewProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar
        variant="back-stop"
        onBackClicked={onGoBack}
        onCloseClicked={onClose}
      />
      <div className="flex flex-1 flex-col px-8 pb-8 gap-2">
        <h1 className="text-3xl">{t("summary")}</h1>
        <FromTo tx={transaction} />
        <div className="card bg-secondary px-4 py-2 grid grid-cols-2">
          <div className="text-[#7D7A9C] py-2">Kind</div>
          <div className="capitalize text-right py-2">{transaction.type}</div>
          {transaction.type !== "delegation" && (
            <>
              <div className="text-[#7D7A9C] py-2">{t("amount")}</div>
              <div className="capitalize text-right py-2">
                {transaction.amount} MINA
              </div>
            </>
          )}
          <div className="text-[#7D7A9C] py-2">{t("fee")}</div>
          <div className="capitalize text-right py-2">
            {transaction.fee} MINA
          </div>
          <div className="divider col-span-2 my-0" />
          <div className="text-[#7D7A9C] py-2">{t("total")}</div>
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
