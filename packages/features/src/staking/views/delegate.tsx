import { AppLayout } from "@/components/app-layout"

import { MenuBar } from "@/components/menu-bar"
import { DelegateForm } from "../components/delegate-form"

type DelegateViewProps = {
  advanced: boolean
  setAdvanced: (advanced: boolean) => void
  onGoBack: () => void
}

export const DelegateView = ({
  onGoBack,
  advanced,
  setAdvanced,
}: DelegateViewProps) => {
  return (
    <AppLayout>
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <DelegateForm advanced={advanced} setAdvanced={setAdvanced} />
    </AppLayout>
  )
}
