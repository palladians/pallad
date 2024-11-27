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
    // Convert hex to bytes and then to characters, stopping at first null byte
    const bytes = hex.match(/.{1,2}/g) || []
    let result = ""
    for (const byte of bytes) {
      const charCode = Number.parseInt(byte, 16)
      if (charCode === 0) break // Stop at first null byte
      result += String.fromCharCode(charCode)
    }
    return result
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

  const getDisplayPayload = (payload: string) => {
    try {
      const originalPayload = recoverOriginalPayload(payload)
      const parsedPayload = JSON.parse(originalPayload) as Record<string, any>

      // Check if this is a credential with data
      if (
        "credential" in parsedPayload &&
        typeof parsedPayload.credential === "object" &&
        parsedPayload.credential !== null &&
        "data" in parsedPayload.credential
      ) {
        const displayObj: Record<string, any> = {
          data: simplifyCredentialData(parsedPayload.credential.data),
        }

        // Only add description if metadata exists and has description
        if (
          typeof parsedPayload.metadata === "object" &&
          parsedPayload.metadata !== null &&
          "description" in parsedPayload.metadata
        ) {
          displayObj.description = parsedPayload.metadata.description
        }

        return JSON.stringify(displayObj, null, 2)
      }

      return payload
    } catch (error: any) {
      return `Error in getDisplayPayload: ${error}`
    }
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
                  dangerouslySetInnerHTML={{
                    __html: getDisplayPayload(payload),
                  }}
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
