import { useTranslation } from "react-i18next"

import { AppLayout } from "@/components/app-layout"

import { SettingsPageLayout } from "@/components/settings-page-layout"
import { ChevronRight, SquareArrowOutUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import packageJson from "../../../package.json"

const ButtonWrapperStyles =
  "flex items-center justify-between p-6 rounded-xl bg-secondary"

const Links = [
  {
    label: useTranslation().t("faq"),
    href: "https://get.pallad.co/faq",
  },
  {
    label: useTranslation().t("support"),
    href: "https://get.pallad.co/support",
  },
  {
    label: useTranslation().t("term-of-services"),
    href: "https://get.pallad.co/terms",
  },
  {
    label: useTranslation().t("version"),
    content: packageJson.version,
  },
]

type AboutViewProps = {
  onCloseClicked: () => void
}

export const AboutView = ({ onCloseClicked }: AboutViewProps) => {
  return (
    <AppLayout>
      <SettingsPageLayout title="About" onCloseClicked={onCloseClicked}>
        <div className="flex flex-col space-y-2">
          {Links.map((link) => {
            if (link.content) {
              return (
                <div key={link.label} className={ButtonWrapperStyles}>
                  <p>{link.label}</p>
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
                  <p>{link.label}</p>
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
                <p>{link.label}</p>
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
