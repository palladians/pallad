import { truncateString } from "@/common/lib/string"
import clsx from "clsx"
import type { Dispatch, SetStateAction } from "react"
import type { Account } from "../types"

type AccountListProps = {
  accounts: Account[]
  handleSelect: Dispatch<SetStateAction<Account>>
}

export const AccountList = ({ accounts, handleSelect }: AccountListProps) => {
  return (
    <div className="space-y-2 py-5">
      <div className="text-mint">Other</div>
      <div className="text-2xl">Wallets</div>
      {accounts.map((account) => {
        return (
          <button
            key={account.name}
            type="button"
            className={clsx(
              "bg-secondary w-full px-6 py-4 flex justify-between rounded-2xl hover:bg-primary",
            )}
            onClick={() => handleSelect(account)}
          >
            <p>{account.name}</p>
            <p>
              {truncateString({
                value: account.publicKey,
                endCharCount: 3,
                firstCharCount: 5,
              })}
            </p>
          </button>
        )
      })}
    </div>
  )
}
