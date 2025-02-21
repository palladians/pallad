import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import { useTranslation } from "react-i18next"
import { WalletDetails } from "../components/wallet-details"

type WalletManagementProps = {
  onGoBack: () => void
  networkId: string
  publicKey: string
  walletName: string
  onCopyWalletAddress: () => void
}

export const WalletManagementView = ({
  publicKey,
  onGoBack,
  networkId,
  walletName,
  onCopyWalletAddress,
}: WalletManagementProps) => {
  const { t } = useTranslation()
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
        <WalletDetails
          onCopyWalletAddress={onCopyWalletAddress}
          walletName={walletName}
          publicKey={publicKey}
        />
      </ManagementPageLayout>
    </AppLayout>
  )
}
