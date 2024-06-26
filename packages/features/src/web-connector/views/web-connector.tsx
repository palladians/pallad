import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import type { SubmitHandler } from "react-hook-form"
import { ConfirmationForm } from "../components/confirmation-form"
import { InputForm } from "../components/input-form"
import type { UserInputForm } from "../types"

type WebConnectorViewProps = {
  title: string
  payload: string
  inputType: string
  onConfirm: () => void
  onDecline: () => void
  onReject: () => void
  onSubmit: SubmitHandler<UserInputForm>
}

export const WebConnectorView = ({
  title,
  payload,
  inputType,
  onDecline,
  onReject,
  onConfirm,
  onSubmit,
}: WebConnectorViewProps) => {
  const onClose = () => {
    onDecline()
    onReject()
  }
  return (
    <AppLayout>
      <MenuBar variant="card" onCloseClicked={onClose} />
      <div className="flex flex-1 flex-col px-8 pb-8">
        <div className="flex flex-col flex-1 gap-4">
          <h1 className="text-2xl">{title}</h1>
          <div
            // biome-ignore lint: Sanitized by DOMPurify
            dangerouslySetInnerHTML={{ __html: payload }}
            className="card bg-secondary h-48 p-4 overflow-y-scroll whitespace-pre-wrap"
          />
        </div>
        <div className="flex justify-center items-center">
          {inputType === "confirmation" && (
            <ConfirmationForm onConfirm={onConfirm} onDecline={onDecline} />
          )}
          {["text", "password"].includes(inputType) && (
            <InputForm
              inputType={inputType}
              onSubmit={onSubmit}
              onReject={onReject}
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
