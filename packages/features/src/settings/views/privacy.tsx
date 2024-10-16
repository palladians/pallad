import { useTranslation } from "react-i18next"

import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import clsx from "clsx"

type PrivacyViewProps = {
  onCloseClicked: () => void
  shareData: boolean
  setShareData: (shareData: boolean) => void
}

export const PrivacyView = ({
  onCloseClicked,
  shareData,
  setShareData,
}: PrivacyViewProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout>
      <SettingsPageLayout title="Privacy" onCloseClicked={onCloseClicked}>
        <div className="pl-6 pr-4 py-4 flex items-center justify-between bg-secondary rounded-2xl">
          <div>
            <p>{t("sharedData")}</p>
            <p className="text-sm">{t("anomymousData")}</p>
          </div>
          <input
            type="checkbox"
            className={clsx(
              "toggle bg-white hover:bg-white border-[#F6C177]",
              shareData && "[--tglbg:#F6C177]",
            )}
            checked={shareData}
            onChange={(event) => setShareData(event.target.checked)}
          />
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
