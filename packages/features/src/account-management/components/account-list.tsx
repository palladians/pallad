import { truncateString } from "@/common/lib/string"
import type { SingleCredentialState } from "@palladxyz/vault"
import clsx from "clsx"

type AccountListProps = {
  accounts: SingleCredentialState[]
  handleSelect: (account: SingleCredentialState) => void
}

export const AccountList = ({ accounts, handleSelect }: AccountListProps) => {
  return (
    <div className="space-y-2 py-5">
      <div className="text-mint">Other</div>
      <div className="text-2xl">Wallets</div>
      {accounts?.map((account) => {
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
