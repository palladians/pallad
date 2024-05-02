import { AppLayout } from "@/components/app-layout"

import { MenuBar } from "@/components/menu-bar"
import { NewAddressForm } from "../components/new-address-form"

type NewAddressViewProps = {
  onGoBack: () => void
}

export const NewAddressView = ({ onGoBack }: NewAddressViewProps) => {
  return (
    <AppLayout>
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <div className="flex flex-col flex-1 p-4">
        <NewAddressForm />
      </div>
    </AppLayout>
  )
}
