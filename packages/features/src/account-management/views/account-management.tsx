import { AccountDetails } from "@/account-management/components/account-details"
import { AccountList } from "@/account-management/components/account-list"
import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import type { SingleCredentialState } from "@palladxyz/vault"
import { useTranslation } from "react-i18next"

type AccountManagementProps = {
  onGoBack: () => void
  walletName: string
  accounts: SingleCredentialState[]
  onSelectAccount: (account: SingleCredentialState) => void
  selectedAccount: SingleCredentialState
  deriveNewAccount: () => void
}

export const AccountManagementView = ({
  onGoBack,
  walletName,
  accounts,
  onSelectAccount,
  selectedAccount,
  deriveNewAccount,
}: AccountManagementProps) => {
  const { t } = useTranslation()

  return (
    <AppLayout>
      <ManagementPageLayout
        title={t(walletName)}
        onCloseClicked={onGoBack}
        headerContent={
          <button
            className="flex items-center"
            onClick={async () => {
              await deriveNewAccount()
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
        {/* <AccountDetails account={selectedWallet} accounts={accounts} /> */}
        <AccountDetails account={selectedAccount} />
        <AccountList accounts={accounts} handleSelect={onSelectAccount} />
      </ManagementPageLayout>
    </AppLayout>
  )
}
