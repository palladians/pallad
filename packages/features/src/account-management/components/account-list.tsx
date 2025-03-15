import { truncateString } from "@/common/lib/string"
import type { SingleCredentialState } from "@palladxyz/vault"
import clsx from "clsx"
import { useEffect, useState } from "react"

type AccountListProps = {
  accounts: SingleCredentialState[]
  handleSelect: (account: SingleCredentialState) => void
}

export const AccountList = ({ accounts, handleSelect }: AccountListProps) => {
  const [sortedAccounts, setSortedAccounts] = useState<SingleCredentialState[]>(
    [],
  )

  useEffect(() => {
    const sorted = accounts
      ? [...accounts].sort(
          (a, b) =>
            //orderd by addressIndex - not sure if this is the correct way to sort
            (a?.credential?.addressIndex ?? Number.POSITIVE_INFINITY) -
            (b?.credential?.addressIndex ?? Number.POSITIVE_INFINITY),
        )
      : []

    setSortedAccounts(sorted)
  }, [accounts])

  return (
    <div className="space-y-2 py-5">
      <div className="text-mint">Other</div>
      <div className="text-2xl">Wallets</div>
      {sortedAccounts?.map((account) => {
        return (
          <button
            key={account?.credentialName}
            type="button"
            className={clsx(
              "bg-secondary w-full px-6 py-4 flex justify-between rounded-2xl hover:bg-primary",
            )}
            onClick={() => handleSelect(account)}
          >
            <p>
              {account?.credentialName &&
                truncateString({
                  value: account?.credentialName,
                  endCharCount: 1,
                  firstCharCount: 12,
                })}
            </p>
            <p>
              {account?.credential?.address &&
                truncateString({
                  value: account?.credential?.address,
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
