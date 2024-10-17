import { Mina } from "@palladxyz/mina-core"

import { AppLayout } from "@/components/app-layout"
import dayjs from "dayjs"

import { getTxSide } from "@/common/lib/tx"
import { FromTo } from "@/components/from-to"
import { HashDropdown } from "@/components/hash-dropdown"
import { MenuBar } from "@/components/menu-bar"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <div className="px-8 pb-6">
        <h2 className="text-3xl mb-6">{t("transactionDetail")}</h2>
        <div className="space-y-2">
          <FromTo tx={transaction} />
          <div className="py-3 px-4 space-y-4 bg-secondary rounded-2xl">
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">{t("kind")}</p>
              <p className="text-right">
                {transaction.type === Mina.TransactionType.PAYMENT
                  ? "Transaction"
                  : "Delegation"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">{t("type")}</p>
              <p className="text-right">
                {side === "incoming" ? "Received" : "Sent"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">{t("amount")}</p>
              <p className="text-right">{`${transaction.amount} MINA`}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">{t("dateTime")}</p>
              <p className="text-right">
                {dayjs(transaction.dateTime ?? "").format("DD/MM/YY - HH:mm")}
              </p>
            </div>
            <hr className="border-[#413E5E]" />
            <div className="flex items-center justify-between">
              <p className="text-[#7D7A9C]">Hash</p>
              <HashDropdown
                hash={transaction.hash ?? ""}
                className="w-32 break-all text-right"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
