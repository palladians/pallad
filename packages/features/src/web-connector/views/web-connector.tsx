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

  const decodeHexString = (hex: string): string => {
    const bytes = new Uint8Array(
      hex.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)),
    )
    return new TextDecoder().decode(bytes).replace(/\0/g, "")
  }

  const simplifyCredentialData = (data: Record<string, any>) => {
    const simplified: Record<string, string> = {}
    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === "object" &&
        value !== null &&
        "_type" in value &&
        "value" in value
      ) {
        if (value._type === "Bytes") {
          simplified[key] = decodeHexString(value.value)
        } else {
          simplified[key] = value.value
        }
      } else {
        simplified[key] = value
      }
    }
    return simplified
  }

  const isCredential = (value: unknown): value is Record<string, any> => {
    if (typeof value !== "object" || value === null) return false

    const obj = value as Record<string, any>
    return (
      "credential" in obj &&
      typeof obj.credential === "object" &&
      obj.credential !== null &&
      "data" in obj.credential
    )
  }

  const renderPayload = (payload: string) => {
    const originalPayload = recoverOriginalPayload(payload)
    const parsedPayload = JSON.parse(originalPayload) as Record<string, any>
    if (!isCredential(parsedPayload)) {
      return <pre className="whitespace-pre-wrap break-all">{payload}</pre>
    }

    const simplifiedData = simplifyCredentialData(parsedPayload.credential.data)
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
