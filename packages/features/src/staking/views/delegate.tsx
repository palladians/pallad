import { AppLayout } from "@/components/app-layout"

import { MenuBar } from "@/components/menu-bar"
import { DelegateForm } from "../components/delegate-form"

type DelegateViewProps = {
  onGoBack: () => void
}

export const DelegateView = ({ onGoBack }: DelegateViewProps) => {
  return (
    <AppLayout>
      <MenuBar variant="dashboard" />
      <div className="flex flex-1 flex-col p-4 gap-4">
        <DelegateForm />
      </div>
    </AppLayout>
  )
}
