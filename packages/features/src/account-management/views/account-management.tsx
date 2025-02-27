import { AccountDetails } from "@/account-management/components/account-details"
import { AccountList } from "@/account-management/components/account-list"
import type { Account } from "@/account-management/types"
import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

type AccountManagementProps = {
  onGoBack: () => void
  walletName: string
  accounts: Account[]
}

export const AccountManagementView = ({
  onGoBack,
  walletName,
  accounts,
}: AccountManagementProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [selectedWallet, setSelectedWallet] = useState<Account>(accounts[0])

  console.log("Account management", selectedWallet)

  useEffect(() => {
    if (accounts) setSelectedWallet(accounts[0])
  }, [accounts])

  return (
    <AppLayout>
      <ManagementPageLayout
        title={t(walletName)}
        onCloseClicked={onGoBack}
        headerContent={
          <button
            className="flex items-center"
            onClick={() => {
              navigate("/accounts/add")
            }}
            type="button"
          >
            Add
            <div className="mx-2">
              <Plus />
            </div>
          </button>
        }
      >
        <AccountDetails account={selectedWallet} accounts={accounts} />
        <AccountList accounts={accounts} handleSelect={setSelectedWallet} />
      </ManagementPageLayout>
    </AppLayout>
  )
}
