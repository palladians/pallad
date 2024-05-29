import { AppLayout } from "@/components/app-layout"

import { MenuBar } from "@/components/menu-bar"
import { SendForm } from "../components/send-form"

type SendViewProps = {
  onGoBack: () => void
  balance: number
  fiatPrice: number
  advanced: boolean
  setAdvanced: (advanced: boolean) => void
  currentNetwork: string
}

export const SendView = ({
  onGoBack,
  balance,
  fiatPrice,
  advanced,
  setAdvanced,
  currentNetwork,
}: SendViewProps) => {
  return (
    <AppLayout>
      <MenuBar
        variant="wallet"
        onCloseClicked={onGoBack}
        currentNetwork={currentNetwork}
      />
      <div className="flex flex-col flex-1 px-8">
        <SendForm
          balance={balance}
          fiatPrice={fiatPrice}
          advanced={advanced}
          setAdvanced={setAdvanced}
        />
      </div>
    </AppLayout>
  )
}
