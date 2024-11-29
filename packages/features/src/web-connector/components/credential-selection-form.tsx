import { createCredentialHash } from "@palladco/web-provider"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
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
          data?:
            | Record<string, unknown>
            | {
                _type: "Struct"
                properties: Record<string, unknown>
              }
            | {
                _type: "DynamicRecord"
                maxEntries: number
                knownShape: Record<string, unknown>
              }
        }
      >
    }
  }
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

// Extract data fields from input data which could be direct, nested in properties, or in knownShape
const extractDataFields = (data: any): string[] => {
  if (!data) return []

  // Handle Struct type with properties
  if (data._type === "Struct" && data.properties) {
    return Object.keys(data.properties)
  }

  // Handle DynamicRecord with knownShape
  if (data._type === "DynamicRecord" && data.knownShape) {
    return Object.keys(data.knownShape)
  }

  // Handle direct data fields
  return Object.keys(data)
}

// Get requested credential info from presentation request
const getRequestedCredentialInfo = (
  presentationRequest: PayloadWithPresentation["presentationRequest"],
) => {
  const credentialRequests: Array<{ type: string; dataFields: string[] }> = []

  for (const input of Object.values(presentationRequest.spec.inputs)) {
    if (input.type === "credential" && input.credentialType && input.data) {
      credentialRequests.push({
        type: input.credentialType,
        dataFields: extractDataFields(input.data),
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

const CredentialDisplay = ({ credential }: { credential: any }) => {
  const witnessType = credential.witness?.type || "unknown"
  const credentialData =
    credential.credential.value?.data || credential.credential.data
  const simplifiedData = simplifyCredentialData(credentialData)
  const description = credential.metadata?.description

  return (
    <div className="space-y-2">
      {description && <p className="text-xs text-primary">{description}</p>}
      <pre className="text-2xs whitespace-pre-wrap break-all bg-neutral-900 p-2 rounded">
        {JSON.stringify(simplifiedData, null, 2)}
      </pre>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-neutral-400">
          Type: {witnessType}
        </span>
      </div>
    </div>
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
            <CredentialDisplay credential={credentialData.credential} />
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

export default SelectionForm
