import { AppLayout } from "@/components/app-layout"

import { SendForm } from "../components/send-form"

type SendViewProps = {
  onGoBack: () => void
}

export const SendView = ({ onGoBack }: SendViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 p-4">
          <SendForm />
        </div>
      </div>
    </AppLayout>
  )
}
