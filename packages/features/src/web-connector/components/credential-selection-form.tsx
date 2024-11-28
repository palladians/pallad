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
  presentationRequest: {
    spec: {
      inputs: Record<
        string,
        {
          type: string
          credentialType?: string
          data?: Record<string, unknown>
        }
      >
    }
  }
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
    Array.isArray((payload as PayloadWithPresentation).storedCredentials) &&
    "presentationRequest" in payload &&
    typeof (payload as PayloadWithPresentation).presentationRequest ===
      "object" &&
    (payload as PayloadWithPresentation).presentationRequest !== null &&
    "spec" in (payload as PayloadWithPresentation).presentationRequest &&
    typeof (payload as PayloadWithPresentation).presentationRequest.spec ===
      "object" &&
    (payload as PayloadWithPresentation).presentationRequest.spec !== null &&
    "inputs" in (payload as PayloadWithPresentation).presentationRequest.spec
  )
}

// Get requested credential info from presentation request
const getRequestedCredentialInfo = (
  presentationRequest: PayloadWithPresentation["presentationRequest"],
) => {
  const credentialRequests: Array<{ type: string; dataFields: string[] }> = []

  // get credentialType and the required keys
  for (const input of Object.values(presentationRequest.spec.inputs)) {
    if (input.type === "credential" && input.credentialType && input.data) {
      credentialRequests.push({
        type: input.credentialType,
        dataFields: Object.keys(input.data),
      })
    }
  }

  return credentialRequests
}

// Get credential data keys accounting for both simple and recursive/struct credentials
const getCredentialDataKeys = (credential: any): string[] => {
  // get data from either credential.data or credential.value.data
  const data = credential.credential.value?.data || credential.credential.data
  return data ? Object.keys(data) : []
}

// Check if credential matches request requirements
const credentialMatchesRequest = (
  credential: any,
  requestedType: string,
  requestedFields: string[],
): boolean => {
  // Check witness type
  if (credential.witness?.type !== requestedType) {
    return false
  }

  // Get credential data fields
  const credentialFields = getCredentialDataKeys(credential)

  // Check request data fields are subset of credential fields
  return requestedFields.every((field) => credentialFields.includes(field))
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

      // Get requested credential requirements
      const credentialRequirements = isPayloadWithPresentation(parsedPayload)
        ? getRequestedCredentialInfo(parsedPayload.presentationRequest)
        : []

      // Extract credentials
      const storedCredentials = Array.isArray(parsedPayload)
        ? parsedPayload
        : isPayloadWithPresentation(parsedPayload)
          ? parsedPayload.storedCredentials
          : []

      // Filter credentials based on matching both type and required data fields
      const filteredCredentials = storedCredentials.filter((credential: any) =>
        credentialRequirements.some((req) =>
          credentialMatchesRequest(credential, req.type, req.dataFields),
        ),
      )

      return filteredCredentials.map((credential: any) => ({
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
