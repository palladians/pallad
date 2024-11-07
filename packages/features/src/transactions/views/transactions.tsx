import type { Mina } from "@palladxyz/mina-core"
import { Filter, X } from "lucide-react"
import { groupBy } from "rambda"
import { Link } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"

import { formatCompact } from "@/common/lib/numbers"
import { getTxSide } from "@/common/lib/tx"
import { MenuBar } from "@/components/menu-bar"
import clsx from "clsx"
import dayjs from "dayjs"
import { useState } from "react"
import { TxTile } from "../components/tx-tile"

import { useTranslation } from "react-i18next"

const Filters = {
  all: "All",
  sent: "Sent",
  received: "Received",
}

const dateFromNow = (dateTime: string) => {
  const now = dayjs()
  const date = dayjs(dateTime)
  return now.diff(date, "days") < 2
    ? date.fromNow()
    : date.format("DD MMM YYYY")
}

const structurizeTx = (tx: Mina.TransactionBody, fiatPrice: number) => {
  const rawAmount = Number(tx.amount)
  const minaAmount = formatCompact({ value: rawAmount })
  return {
    ...tx,
    date: dateFromNow(tx.dateTime!),
    time: dayjs(tx.dateTime!).format("HH:mm"),
    minaAmount,
    fiatAmount: Number(rawAmount * fiatPrice).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
  }
}

type TransactionsViewProps = {
  fiatPrice: number
  pendingHashes: string[]
  publicKey: string
  transactions: Mina.TransactionBody[]
  transactionsError: boolean
  openPendingTransactions: () => void
}

export const TransactionsView = ({
  fiatPrice,
  pendingHashes,
  publicKey,
  transactions,
  transactionsError,
  openPendingTransactions,
}: TransactionsViewProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(Filters.all)
  const showTransactions = transactions.length > 0 && !transactionsError
  const txs = transactions.map((tx) => structurizeTx(tx, fiatPrice))
  const txsFiltered = txs.filter((tx) => {
    if (currentFilter === Filters.all) return true
    const side = getTxSide({ tx, currentWalletAddress: publicKey })
    return side === (currentFilter === Filters.sent ? "outgoing" : "incoming")
  })
  const txsGrouped = groupBy((tx) => tx.date, txsFiltered)
  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="dashboard" />
      <div className="px-8 mt-1 flex items-center justify-between">
        <h2 className="text-3xl">{t("transactions.activity")}</h2>
        {showTransactions && (
          <button
            type="button"
            className="flex items-center space-x-1"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <p>{t("transactions.filters")}</p>
            {filtersOpen ? (
              <X
                width={24}
                height={24}
                className="text-[#F6C177] animate-in fade-in"
              />
            ) : (
              <Filter
                width={24}
                height={24}
                className="text-[#F6C177] animate-in fade-in"
              />
            )}
          </button>
        )}
      </div>
      {filtersOpen && (
        <div className="px-8 mt-5 flex space-x-1">
          {Object.values(Filters).map((filter) => {
            return (
              <button
                key={filter}
                type="button"
                className={clsx(
                  "btn",
                  filter === currentFilter && "btn-primary",
                )}
                onClick={() => setCurrentFilter(filter)}
              >
                {filter}
              </button>
            )
          })}
        </div>
      )}
      {showTransactions ? (
        <div className="px-8 pb-8 mt-6 space-y-4">
          {pendingHashes.length > 0 && (
            <p data-testid="transactions/pendingTransactions">
              {t("transactions.pendingTransactions")}{" "}
              <button type="button" onClick={openPendingTransactions}>
                {t("transactions.preview")}
              </button>
            </p>
          )}
          {Object.values(txsGrouped).map((txs) => (
            <div key={txs[0].date} className="flex flex-col space-y-4">
              <p>{txs[0].date}</p>
              {txs.map((tx) => (
                <TxTile
                  key={tx.hash}
                  tx={tx}
                  currentWalletAddress={publicKey}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-center">
          <p className="mb-2 text-xl">{t("transactions.nothingHere")}</p>
          <p className="mb-4 w-64">{t("transactions.detailsGetStarted")}</p>
          <Link to="/receive" className="w-36 btn btn-primary">
            {t("transactions.receive")}
          </Link>
        </div>
      )}
    </AppLayout>
  )
}
