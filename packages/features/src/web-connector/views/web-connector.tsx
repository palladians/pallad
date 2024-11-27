import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { Skeleton } from "@/components/skeleton"
import type { SubmitHandler } from "react-hook-form"
import { ConfirmationForm } from "../components/confirmation-form"
import {
  SelectionForm,
  recoverOriginalPayload,
} from "../components/credential-selection-form"
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

  const isCredential = (value: unknown): value is Record<string, any> => {
    if (typeof value !== "object" || value === null) return false

    const obj = value as Record<string, any>
    if ("credential" in obj) {
      const cred = obj.credential
      return (
        typeof cred === "object" &&
        cred !== null &&
        ("data" in cred || // Simple credential
          ("value" in cred &&
            typeof cred.value === "object" &&
            "data" in cred.value)) // Recursive/struct credential
      )
    }
    return false
  }

  const simplifyCredentialData = (
    data: Record<string, any>,
  ): Record<string, string> => {
    const simplified: Record<string, string> = {}
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null) {
        if ("bytes" in value) {
          simplified[key] = value.bytes
            .map((b: { value: string }) => b.value)
            .join("")
        } else if ("value" in value) {
          simplified[key] = value.value
        } else {
          simplified[key] = value
        }
      } else {
        simplified[key] = value
      }
    }
    return simplified
  }

  const renderPayload = (payload: string) => {
    const originalPayload = recoverOriginalPayload(payload)
    const parsedPayload = JSON.parse(originalPayload) as Record<string, any>

    if (!isCredential(parsedPayload)) {
      return <pre className="whitespace-pre-wrap break-all">{payload}</pre>
    }

    const credentialData =
      parsedPayload.credential.value?.data || parsedPayload.credential.data
    const simplifiedData = simplifyCredentialData(credentialData)
    const description = parsedPayload.metadata?.description

    return (
      <div className="space-y-4">
        {description && <p className="text-sm">{description}</p>}
        <pre className="whitespace-pre-wrap break-all bg-neutral-900 p-3 rounded">
          {JSON.stringify(simplifiedData, null, 2)}
        </pre>
      </div>
    )
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
                <div className="card bg-secondary h-48 p-4 overflow-y-scroll">
                  {(() => {
                    try {
                      return renderPayload(payload)
                    } catch (error) {
                      return (
                        <pre className="whitespace-pre-wrap break-all">{`Error: ${error}`}</pre>
                      )
                    }
                  })()}
                </div>
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
