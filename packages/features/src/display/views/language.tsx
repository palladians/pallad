import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useState } from "react"

const Items = [
  { label: "English", value: "ENG" },
  { label: "French", value: "FRA" },
  { label: "Spanish", value: "SPA" },
  { label: "Turkish", value: "TUR" },
  { label: "Portugese", value: "POR" },
  { label: "Chinese", value: "CHI" },
]

type LanguageViewProps = {
  onCloseClicked: () => void
}

export const LanguageView = ({ onCloseClicked }: LanguageViewProps) => {
  const [selected, setSelected] = useState(Items[0].value)
  return (
    <AppLayout>
      <SettingsPageLayout title="Language" onCloseClicked={onCloseClicked}>
        <div className="space-y-2">
          {Items.map((item) => {
            const active = item.value === selected
            return (
              <button
                key={item.label}
                type="button"
                className={clsx(
                  "w-full pl-6 pr-4 py-4 flex items-center justify-between rounded-2xl hover:bg-secondary",
                  active && "bg-secondary",
                )}
                onClick={() => setSelected(item.value)}
              >
                <p>{item.label}</p>
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
