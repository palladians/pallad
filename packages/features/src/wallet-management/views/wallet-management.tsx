import Plus from "@/common/assets/plus.svg?react"
import { AppLayout } from "@/components/app-layout"
import { ManagementPageLayout } from "@/components/management-layout"
import { useTranslation } from "react-i18next"

type WalletManagementProps = {
  onGoBack: () => void
  networkId: string
}

export const WalletManagementView = ({
  onGoBack,
  networkId,
}: WalletManagementProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout>
      <ManagementPageLayout
        title={t("My wallet")}
        onCloseClicked={onGoBack}
        headerContent={
          <div className="flex items-center">
            Add{" "}
            <div className="mx-2">
              <Plus />
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-1 flex-1 pb-8 items-center">Test</div>
      </ManagementPageLayout>
    </AppLayout>
  )
}
