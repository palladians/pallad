import { createCredentialHash } from "@palladco/web-provider"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import xss from "xss"
import yaml from "yaml"

type SelectionFormProps = {
  onSubmit: (selectedCredentials: string) => void
  onReject: () => void
  submitButtonLabel?: string
  rejectButtonLabel?: string
  payload: string
  loading: boolean
}

interface PayloadWithPresentation {
  storedCredentials: any[]
  presentationRequest: any
}

const sanitizeCredential = (credential: any) => {
  const yamlOptions = {
    indent: 2,
    lineWidth: 70,
    minContentWidth: 0,
  }
  const yamlPayload = yaml.stringify(credential, yamlOptions)
  return xss(yamlPayload)
}

export const recoverOriginalPayload = (sanitizedPayload: string) => {
  const parsedYaml = yaml.parse(sanitizedPayload)
  return JSON.stringify(parsedYaml)
}

const isPayloadWithPresentation = (
  payload: unknown,
): payload is PayloadWithPresentation => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "storedCredentials" in payload &&
    Array.isArray((payload as PayloadWithPresentation).storedCredentials)
  )
}

export const SelectionForm = ({
  onSubmit,
  onReject,
  submitButtonLabel,
  rejectButtonLabel,
  payload,
  loading,
}: SelectionFormProps) => {
  const { t } = useTranslation()
  const [selectedCredentials, setSelectedCredentials] = useState<any[]>([])

  const credentials = React.useMemo(() => {
    try {
      const originalPayload = recoverOriginalPayload(payload)
      const parsedPayload = JSON.parse(originalPayload)

      // Extract credentials using type guard
      const storedCredentials = Array.isArray(parsedPayload)
        ? parsedPayload
        : isPayloadWithPresentation(parsedPayload)
          ? parsedPayload.storedCredentials
          : []

      return storedCredentials.map((credential: any) => ({
        // TODO: use correct id
        id: createCredentialHash(credential),
        credential,
        sanitizedDisplay: sanitizeCredential(credential),
      }))
    } catch (error: any) {
      throw Error(`Issue with parsing: ${error}: ${payload}`)
    }
  }, [payload])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(JSON.stringify(selectedCredentials.map((c) => c.credential)))
  }

  const handleToggleCredential = (credentialData: any) => {
    setSelectedCredentials((prev) =>
      prev.some((c) => c.id === credentialData.id)
        ? prev.filter((c) => c.id !== credentialData.id)
        : [...prev, credentialData],
    )
  }

  const isSelected = (credentialData: any) => {
    return selectedCredentials.some((c) => c.id === credentialData.id)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col items-center gap-2 w-full"
    >
      <div className="w-full overflow-y-auto max-w-[448px] max-h-48 flex flex-col gap-2 bg-base-200 p-2 rounded-2xl">
        {credentials.map((credentialData) => (
          <label
            key={credentialData.id}
            className="flex items-center gap-2 p-3 rounded-2xl bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-xs"
              checked={isSelected(credentialData)}
              onChange={() => handleToggleCredential(credentialData)}
              disabled={loading}
            />
            <div className="font-medium break-all whitespace-pre-wrap max-w-[398px] text-2xs leading-tight">
              {credentialData.sanitizedDisplay || "Unknown Credential"}
            </div>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full"
        disabled={loading || selectedCredentials.length === 0}
      >
        {submitButtonLabel ?? t("webConnector.continue")}
      </button>

      <button
        type="button"
        className="btn max-w-48 w-full"
        onClick={onReject}
        disabled={loading}
      >
        {rejectButtonLabel ?? t("webConnector.reject")}
      </button>
    </form>
  )
}
