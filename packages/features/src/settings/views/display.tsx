import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import { ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const ButtonWrapperStyles =
  "pl-6 pr-4 py-6 flex items-center justify-between rounded-2xl bg-secondary"

const Links = [
  {
    label: "Currency",
    value: "$USD",
    href: "/settings/display/currency",
  },
  {
    label: "Language",
    value: "ENG",
    href: "/settings/display/language",
  },
]

type DisplayViewProps = {
  onCloseClicked: () => void
}

export const DisplayView = ({ onCloseClicked }: DisplayViewProps) => {
  const { t } = useTranslation()
  const getLabel = (label: string) => {
    return label === "Currency"
      ? t("settings.currency")
      : t("settings.language")
  }
  return (
    <AppLayout>
      <SettingsPageLayout title="Display" onCloseClicked={onCloseClicked}>
        <div className="space-y-2">
          <div className={ButtonWrapperStyles}>
            <p>{t("settings.darkMode")}</p>
            <input
              type="checkbox"
              className="toggle [--tglbg:#F6C177] bg-white hover:bg-white border-[#F6C177]"
            />
          </div>
          {Links.map((link) => {
            return (
              <Link
                key={link.label}
                to={link.href}
                className={ButtonWrapperStyles}
              >
                <p>{getLabel(link.label)}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-[#7D7A9C]">{link.value}</p>
                  <ChevronRight
                    width={24}
                    height={24}
                    className="text-[#F6C177]"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
