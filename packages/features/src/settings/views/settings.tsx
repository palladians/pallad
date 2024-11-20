import { AppWindowMac, Eye, Globe, Info } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Links = [
  // TODO: Uncomment when we add multi-account
  // {
  //   label: "Wallet",
  //   description: "Management and networks",
  //   href: "/settings/wallet",
  //   Icon: WalletMinimal,
  // },
  {
    label: "Authorized zkApps",
    description: "zkApps connected to your wallet",
    href: "/settings/authorized-zkapps",
    Icon: AppWindowMac,
  },
  {
    label: "Privacy",
    description: "Data sharing",
    href: "/settings/privacy",
    Icon: Eye,
  },
  // TODO: Uncomment when we add multiple locales
  {
    label: "Display",
    description: "Languages and currencies",
    href: "/settings/display",
    Icon: Globe,
  },
  {
    label: "About",
    description: "Everything about us",
    href: "/settings/about",
    Icon: Info,
  },
]

type SettingsViewProps = {
  onCloseClicked: () => void
  onDonateClicked: () => void
  onLogOut: () => void
}

export const SettingsView = ({
  onCloseClicked,
  onDonateClicked,
  onLogOut,
}: SettingsViewProps) => {
  const { t } = useTranslation()
  const getLabel = (label: string) => {
    switch (label) {
      case "Wallet":
        return t("settings.wallet")
      case "Privacy":
        return t("settings.privacy")
      case "About":
        return t("settings.about")
      case "Display":
        return t("settings.display")
      case "Authorized zkApps":
        return t("settings.zkapps")
      default:
        return ""
    }
  }
  return (
    <AppLayout>
      <SettingsPageLayout
        title={t("labels.settings")}
        onCloseClicked={onCloseClicked}
        headerContent={
          <div className="mt-6 px-6 py-4 flex items-center justify-between bg-neutral rounded-2xl">
            <p>{t("settings.buyUsACoffee")}</p>
            <button
              type="button"
              className="px-8 btn btn-primary"
              onClick={onDonateClicked}
            >
              {t("settings.send")}
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full space-y-2">
            {Links.map((link) => {
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="p-4 flex items-center space-x-4 bg-secondary rounded-2xl"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral">
                    <link.Icon
                      width={24}
                      height={24}
                      className="text-[#F6C177]"
                    />
                  </div>
                  <div>
                    <p>{getLabel(link.label)}</p>
                    <p className="text-sm">{link.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <button
            type="button"
            className="px-10 btn"
            data-testid="settings/logOut"
            onClick={onLogOut}
          >
            {t("settings.logOut")}
          </button>
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
