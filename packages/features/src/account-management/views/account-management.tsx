import { AccountDetails } from "@/account-management/components/account-details"
import { AccountList } from "@/account-management/components/account-list"
import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import type { SingleCredentialState } from "@palladxyz/vault"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

type AccountManagementProps = {
  onGoBack: () => void
  walletName: string
  accounts: SingleCredentialState[]
  onSelectAccount: (account: SingleCredentialState) => void
  selectedAccount: SingleCredentialState
  onCopyWalletAddress: () => void
}

export const AccountManagementView = ({
  onGoBack,
  walletName,
  accounts,
  onSelectAccount,
  selectedAccount,
  onCopyWalletAddress,
}: AccountManagementProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <AppLayout>
      <ManagementPageLayout
        title={t(walletName)}
        onCloseClicked={onGoBack}
        headerContent={
          <button
            className="flex items-center"
            onClick={async () => {
              navigate("/accounts/add")
            }}
            type="button"
          >
            {t("accountManagement.addAccount")}
            <div className="mx-2">
              <Plus />
            </div>
          </button>
        }
      >
        <AccountDetails
          account={selectedAccount}
          onCopyWalletAddress={onCopyWalletAddress}
        />
        <AccountList accounts={accounts} handleSelect={onSelectAccount} />
      </ManagementPageLayout>
    </AppLayout>
  )
}
