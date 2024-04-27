import { AppLayout } from "@/components/app-layout"
import { ViewHeading } from "@/components/view-heading"

import { SendForm } from "../components/send-form"

type SendViewProps = {
  onGoBack: () => void
}

export const SendView = ({ onGoBack }: SendViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading title="Send" backButton={{ onClick: onGoBack }} />
        <div className="flex flex-col flex-1 p-4">
          <SendForm />
        </div>
      </div>
    </AppLayout>
  )
}
