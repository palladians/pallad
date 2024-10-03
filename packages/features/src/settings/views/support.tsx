import { useTranslation } from "react-i18next"

import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"

type SupportViewProps = {
  onCloseClicked: () => void
}

export const SupportView = ({ onCloseClicked }: SupportViewProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout>
      <SettingsPageLayout title="Support" onCloseClicked={onCloseClicked}>
        <div className="flex flex-col items-center p-6 space-y-6 bg-secondary rounded-2xl">
          <p>{t("need-help")}</p>
          <a
            href="https://pallad.co/support"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary px-10"
          >
            {t("contact-support")}
          </a>
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
