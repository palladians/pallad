import { AppLayout } from "@/components/app-layout"

import { SettingsPageLayout } from "@/components/settings-page-layout"
import { ChevronRight, SquareArrowOutUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import packageJson from "../../../package.json"

const ButtonWrapperStyles =
  "flex items-center justify-between p-6 rounded-xl bg-secondary"

const Links = [
  {
    label: "FAQ",
    href: "https://get.pallad.co/faq",
  },
  {
    label: "Support",
    href: "https://get.pallad.co/support",
  },
  {
    label: "Terms of Service",
    href: "https://get.pallad.co/terms",
  },
  {
    label: "Version",
    content: packageJson.version,
  },
]

type AboutViewProps = {
  onCloseClicked: () => void
}

export const AboutView = ({ onCloseClicked }: AboutViewProps) => {
  const getLabel = (label: string) => {
    const { t } = useTranslation()
    switch (label) {
      case "FAQ":
        return t("settings.faq")
      case "Support":
        return t("settings.support")
      case "Terms of Service":
        return t("settings.termOfServices")
      case "Version":
        return t("settings.version")
      default:
        return ""
    }
  }
  return (
    <AppLayout>
      <SettingsPageLayout title="About" onCloseClicked={onCloseClicked}>
        <div className="flex flex-col space-y-2">
          {Links.map((link) => {
            if (link.content) {
              return (
                <div key={link.label} className={ButtonWrapperStyles}>
                  <p>{getLabel(link.label)}</p>
                  <p className="text-[#7D7A9C]">{link.content}</p>
                </div>
              )
            }
            if (link.href?.startsWith("http")) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={ButtonWrapperStyles}
                >
                  <p>{getLabel(link.label)}</p>
                  <SquareArrowOutUpRight
                    width={24}
                    height={24}
                    className="text-[#F6C177]"
                  />
                </a>
              )
            }
            return (
              <Link
                key={link.label}
                to={link.href || ""}
                className={ButtonWrapperStyles}
              >
                <p>{getLabel(link.label)}</p>
                <ChevronRight
                  width={24}
                  height={24}
                  className="text-[#F6C177]"
                />
              </Link>
            )
          })}
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
