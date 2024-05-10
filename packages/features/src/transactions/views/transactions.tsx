import type { Mina } from "@palladxyz/mina-core"
import { ArrowDownRight, ArrowUpRight, Clock, Filter, X } from "lucide-react"
import { groupBy } from "rambda"
import { Link } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"

import { TxSide } from "@/common/types"
import { MenuBar } from "@/components/menu-bar"
import clsx from "clsx"
import dayjs from "dayjs"
import { useState } from "react"

const Filters = {
  all: "All",
  sent: "Sent",
  received: "Received",
}

const convertToK = (amount: number) => {
  return amount > 1000 ? `${(amount / 1000).toFixed(3)}k` : amount.toFixed(3)
}

const dateFromNow = (dateTime: string) => {
  const now = dayjs()
  const date = dayjs(dateTime)
  return now.diff(date, "days") < 2
    ? date.fromNow()
    : date.format("DD MMM YYYY")
}

const structurizeTx = (
  tx: Mina.TransactionBody,
  fiatPrice: number,
  publicKey: string,
) => {
  const minaAmount = Number(tx.amount) / 1_000_000_000
  return {
    hash: tx.hash,
    date: dateFromNow(tx.dateTime!),
    time: dayjs(tx.dateTime!).format("HH:mm"),
    minaAmount: convertToK(minaAmount),
    fiatAmount: Number(minaAmount * fiatPrice).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
    side: tx.from === publicKey ? TxSide.OUTGOING : TxSide.INCOMING,
  }
}

type TransactionsViewProps = {
  fiatPrice: number
  pendingHashes: string[]
  publicKey: string
  transactions: Mina.TransactionBody[]
  transactionsError: boolean
}

export const TransactionsView = ({
  fiatPrice,
  pendingHashes,
  publicKey,
  transactions,
  transactionsError,
}: TransactionsViewProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(Filters.all)
  const showTransactions = transactions.length > 0 && !transactionsError
  const txs = transactions.map((tx) => structurizeTx(tx, fiatPrice, publicKey))
  const txsFiltered = txs.filter((tx) => {
    if (currentFilter === Filters.all) return true
    return (
      tx.side ===
      (currentFilter === Filters.sent ? TxSide.OUTGOING : TxSide.INCOMING)
    )
  })
  const txsGrouped = groupBy((tx) => tx.date, txsFiltered)
  return (
    <AppLayout>
      <MenuBar variant="dashboard" />
      <div className="px-8 mt-1 flex items-center justify-between">
        <h2 className="text-3xl">Activity</h2>
        {showTransactions && (
          <button
            type="button"
            className="flex items-center space-x-1"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <p>Filters</p>
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
          {Object.values(txsGrouped).map((txs) => {
            return (
              <div key={txs[0].date} className="flex flex-col space-y-4">
                <p>{txs[0].date}</p>
                {txs.map((tx) => {
                  const pending = pendingHashes.includes(tx.hash)
                  const received = tx.side === TxSide.INCOMING
                  return (
                    <Link
                      key={tx.hash}
                      to={`/transactions/${tx.hash}`}
                      className={clsx(
                        "flex",
                        pending ? "items-center space-x-4" : "justify-between",
                      )}
                    >
                      {pending ? (
                        <>
                          <div className="w-12 h-12 flex items-center justify-center bg-base-100 rounded-full">
                            <Clock
                              width={24}
                              height={24}
                              className="text-[#F6C177]"
                            />
                          </div>
                          <p>Pending transaction</p>
                        </>
                      ) : (
                        <>
                          <div className="flex space-x-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-base-100 rounded-full">
                              {received ? (
                                <ArrowDownRight
                                  width={24}
                                  height={24}
                                  className="text-mint"
                                />
                              ) : (
                                <ArrowUpRight
                                  width={24}
                                  height={24}
                                  className="text-[#D1B4F4]"
                                />
                              )}
                            </div>
                            <div>
                              <p>{received ? "Received" : "Sent"}</p>
                              <p className="text-[#7D7A9C]">{tx.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p>{`${tx.minaAmount} MINA`}</p>
                            <p className="text-[#7D7A9C]">{tx.fiatAmount}</p>
                          </div>
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-center">
          <p className="mb-2 text-xl">Nothing here yet :(</p>
          <p className="mb-4 w-64">
            Here you'll find details about your transactions. Fund your wallet
            to get started!
          </p>
          <Link to="/receive" className="w-36 btn btn-primary">
            Receive
          </Link>
        </div>
      )}
    </AppLayout>
  )
}
