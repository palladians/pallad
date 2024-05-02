import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useState } from "react"

const Languages = [
  "English",
  "French",
  "Spanish",
  "Turkish",
  "Portugese",
  "Chinese",
]

type LanguageViewProps = {
  onCloseClicked: () => void
}

export const LanguageView = ({ onCloseClicked }: LanguageViewProps) => {
  const [selected, setSelected] = useState(Languages[0])
  return (
    <AppLayout>
      <SettingsPageLayout title="Language" onCloseClicked={onCloseClicked}>
        <div className="space-y-2">
          {Languages.map((language) => {
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
          })}
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
