import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useState } from "react"

const Currencies = ["USD", "EUR", "CAD", "LIRA", "YEN", "MINA"]

type CurrencyViewProps = {
  onCloseClicked: () => void
}

export const CurrencyView = ({ onCloseClicked }: CurrencyViewProps) => {
  const [selected, setSelected] = useState(Currencies[0])
  return (
    <AppLayout>
      <SettingsPageLayout title="Currency" onCloseClicked={onCloseClicked}>
        <div className="space-y-2">
          {Currencies.map((currency) => {
            const active = currency === selected
            return (
              <button
                key={currency}
                type="button"
                className={clsx(
                  "w-full pl-6 pr-4 py-4 flex items-center justify-between rounded-2xl hover:bg-secondary",
                  active && "bg-secondary",
                )}
                onClick={() => setSelected(currency)}
              >
                <p>{currency}</p>
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
