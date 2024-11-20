import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface ILanguages {
  nativeName: string
}

const Languages: Record<string, ILanguages> = {
  en: { nativeName: "English" },
  //fr: { nativeName: "French" },
  //es: { nativeName: "Spanish" },
  tr: { nativeName: "Turkish" },
  //pt: { nativeName: "Portugese" },
  //zh: { nativeName: "Chinese" },
}

type LanguageViewProps = {
  onCloseClicked: () => void
}

export const LanguageView = ({ onCloseClicked }: LanguageViewProps) => {
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState(i18n.language)

  console.log(i18n.language)
  return (
    <AppLayout>
      <SettingsPageLayout
        title={t("labels.language")}
        onCloseClicked={onCloseClicked}
      >
        <div className="space-y-2">
          {Object.keys(Languages).map((lng) => {
            const active = lng === selected
            return (
              <button
                key={lng}
                type="button"
                className={clsx(
                  "w-full pl-6 pr-4 py-4 flex items-center justify-between rounded-2xl hover:bg-secondary",
                  active && "bg-secondary",
                )}
                onClick={() => {
                  i18n.changeLanguage(lng)
                  setSelected(lng)
                }}
                disabled={i18n.resolvedLanguage === lng}
              >
                <p>{Languages[lng].nativeName}</p>
                {active && (
                  <Check width={24} height={24} className="text-[#F6C177]" />
                )}
              </button>
            )
          })}
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}

/* {Languages.map((language) => {
  const active = language === selected
  return (
    <button
      key={language}
      type="button"
      className={clsx(
        "w-full pl-6 pr-4 py-4 flex items-center justify-between rounded-2xl hover:bg-secondary",
        active && "bg-secondary",
      )}
      onClick={() => setSelected(language)}
    >
      <p>{language}</p>
      {active && (
        <Check width={24} height={24} className="text-[#F6C177]" />
      )}
    </button>
  )
})} */
