import type { Account } from "@/account-management/types"
import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AccountDetails } from "../components/account-details"
import { AccountList } from "../components/account-list"

type AccountManagementProps = {
  onGoBack: () => void
  networkId: string
  publicKey: string
  walletName: string
  accounts: Account[]
}

export const AccountManagementView = ({
  publicKey,
  onGoBack,
  networkId,
  walletName,
  accounts,
}: AccountManagementProps) => {
  const { t } = useTranslation()
  const [selectedWallet, setSelectedWallet] = useState<Account>(accounts[0])

  return (
    <AppLayout>
      <ManagementPageLayout
        title={t("My wallet")}
        onCloseClicked={onGoBack}
        headerContent={
          <div className="flex items-center">
            Add
            <div className="mx-2">
              <Plus />
            </div>
          </div>
        }
      >
        <AccountDetails account={selectedWallet} />
        <AccountList accounts={accounts} handleSelect={setSelectedWallet} />
      </ManagementPageLayout>
    </AppLayout>
  )
}
