import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import { WalletDetails } from "@/wallet-management/components/wallet-details"
import { WalletList } from "@/wallet-management/components/wallet-list"
import type { Account } from "@/wallet-management/types"
import { useState } from "react"
import { useTranslation } from "react-i18next"

type WalletManagementProps = {
  onGoBack: () => void
  networkId: string
  publicKey: string
  walletName: string
  accounts: Account[]
}

export const WalletManagementView = ({
  publicKey,
  onGoBack,
  networkId,
  walletName,
  accounts,
}: WalletManagementProps) => {
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
        <WalletDetails account={selectedWallet} />
        <WalletList accounts={accounts} handleSelect={setSelectedWallet} />
      </ManagementPageLayout>
    </AppLayout>
  )
}
