import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { Skeleton } from "@/components/skeleton"
import type { SubmitHandler } from "react-hook-form"
import { ConfirmationForm } from "../components/confirmation-form"
import { SelectionForm } from "../components/credential-selection-form"
import { InputForm } from "../components/input-form"
import type { UserInputForm } from "../types"

type WebConnectorViewProps = {
  title: string
  payload: string
  inputType: string
  onConfirm: () => void
  onDecline: () => void
  rejectButtonLabel?: string
  onReject: () => void
  submitButtonLabel?: string
  onSubmit: SubmitHandler<UserInputForm>
  loading: boolean
  loadingMessage?: string
}

export const WebConnectorView = ({
  title,
  payload,
  inputType,
  onDecline,
  rejectButtonLabel,
  onReject,
  onConfirm,
  submitButtonLabel,
  onSubmit,
  loading,
  loadingMessage,
}: WebConnectorViewProps) => {
  const onClose = () => {
    onReject()
    onDecline()
  }
  const handleSelectionSubmit = (selectedCredentials: string) => {
    onSubmit({ userInput: selectedCredentials })
  }

  const displayTitle = loadingMessage || title

  return (
    <div className="flex flex-1 justify-center items-center bg-secondary">
      <div className="flex max-w-[480px] max-h-[772px] h-full flex-1 bg-neutral rounded-xl">
        <AppLayout>
          <MenuBar variant="card" onCloseClicked={onClose} />
          <div className="flex flex-1 flex-col px-8 pb-8">
            <div className="flex flex-col flex-1 gap-4">
              <h1 className="text-2xl">{displayTitle}</h1>
              <Skeleton loading={loading} h="192px">
                <div
                  // biome-ignore lint: Sanitized by `xss`
                  dangerouslySetInnerHTML={{ __html: payload }}
                  className="card bg-secondary h-48 p-4 overflow-y-scroll whitespace-pre-wrap break-all"
                />
              </Skeleton>
            </div>
            <div className="flex justify-center items-center">
              {inputType === "confirmation" && (
                <ConfirmationForm
                  onConfirm={onConfirm}
                  onDecline={onDecline}
                  loading={loading}
                />
              )}
              {["text", "password"].includes(inputType) && (
                <InputForm
                  inputType={inputType}
                  submitButtonLabel={submitButtonLabel}
                  onSubmit={onSubmit}
                  rejectButtonLabel={rejectButtonLabel}
                  onReject={onReject}
                  loading={loading}
                />
              )}
              {inputType === "selection" && (
                <SelectionForm
                  payload={payload}
                  submitButtonLabel={submitButtonLabel}
                  rejectButtonLabel={rejectButtonLabel}
                  onSubmit={handleSelectionSubmit}
                  onReject={onReject}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </AppLayout>
      </div>
    </div>
  )
}
