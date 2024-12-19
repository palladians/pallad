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

// Get all credential requirements from presentation request
const getCredentialRequirements = (
  presentationRequest: PayloadWithPresentation["presentationRequest"],
) => {
  const requirements: Array<{
    inputKey: string
    type: string
    dataFields: string[]
  }> = []

  for (const [key, input] of Object.entries(presentationRequest.spec.inputs)) {
    if (input.type === "credential" && input.credentialType && input.data) {
      requirements.push({
        inputKey: key,
        type: input.credentialType,
        dataFields: extractDataFields(input.data),
      })
    }
  }

  return requirements
}

// Get credential data keys accounting for both simple and recursive/struct credentials
const getCredentialDataKeys = (credential: any): string[] => {
  const data = credential.credential.value?.data || credential.credential.data
  return data ? Object.keys(data) : []
}

// Check if credential matches a specific requirement
const credentialMatchesRequirement = (
  credential: any,
  requirement: {
    type: string
    dataFields: string[]
  },
): boolean => {
  if (credential.witness?.type !== requirement.type) {
    return false
  }

  const credentialFields = getCredentialDataKeys(credential)
  return requirement.dataFields.every((field) =>
    credentialFields.includes(field),
  )
}

// Find all requirements that a credential can satisfy
const findMatchingRequirements = (
  credential: any,
  requirements: Array<{
    inputKey: string
    type: string
    dataFields: string[]
  }>,
) => {
  return requirements.filter((req) =>
    credentialMatchesRequirement(credential, req),
  )
}

const CredentialDisplay = ({
  credential,
  matchingRequirements,
}: {
  credential: any
  matchingRequirements: Array<{
    inputKey: string
    type: string
    dataFields: string[]
  }>
}) => {
  const witnessType = credential.witness?.type || "unknown"
  const credentialData =
    credential.credential.value?.data || credential.credential.data
  const simplifiedData = simplifyCredentialData(credentialData)
  const description = credential.metadata?.description

  return (
    <div className="space-y-2">
      {description && <p className="text-xs text-primary">{description}</p>}
      <pre className="text-2xs whitespace-pre-wrap break-all bg-neutral-900 p-2 rounded-2xl">
        {JSON.stringify(simplifiedData, null, 2)}
      </pre>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-400">
          Type: {witnessType}
        </span>
        <span className="text-xs text-neutral-400">
          Can be used for:{" "}
          {matchingRequirements.map((r) => r.inputKey).join(", ")}
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
  const [selectedCredentials, setSelectedCredentials] = useState<
    Map<string, { credential: any; credentialId: string }>
  >(new Map())

  const { credentials, requirements } = React.useMemo(() => {
    try {
      const originalPayload = recoverOriginalPayload(payload)
      const parsedPayload = JSON.parse(originalPayload)

      const credentialRequirements = isPayloadWithPresentation(parsedPayload)
        ? getCredentialRequirements(parsedPayload.presentationRequest)
        : []

      const storedCredentials = Array.isArray(parsedPayload)
        ? parsedPayload
        : isPayloadWithPresentation(parsedPayload)
          ? parsedPayload.storedCredentials
          : []

      const validCredentials = storedCredentials
        .filter(
          (credential: any) =>
            findMatchingRequirements(credential, credentialRequirements)
              .length > 0,
        )
        .map((credential: any) => ({
          id: createCredentialHash(credential),
          credential,
          matchingRequirements: findMatchingRequirements(
            credential,
            credentialRequirements,
          ),
        }))

      return {
        credentials: validCredentials,
        requirements: credentialRequirements,
      }
    } catch (error: any) {
      throw Error(`Issue with parsing: ${error}: ${payload}`)
    }
  }, [payload])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create an array of credentials in the same order as the requirements
    const orderedCredentials = requirements
      .map((req) => {
        const selected = selectedCredentials.get(req.inputKey)
        return selected?.credential
      })
      .filter(Boolean)

    onSubmit(JSON.stringify(orderedCredentials))
  }

  const handleCredentialSelect = (credentialData: any, inputKey: string) => {
    setSelectedCredentials((prev) => {
      const newMap = new Map(prev)

      // Update or add the selection for this input
      newMap.set(inputKey, {
        credential: credentialData.credential,
        credentialId: credentialData.id,
      })

      return newMap
    })
  }

  const isSelectedFor = (credentialId: string, inputKey: string) => {
    const selection = selectedCredentials.get(inputKey)
    return selection?.credentialId === credentialId
  }

  const allRequirementsMet = requirements.every((req) =>
    selectedCredentials.has(req.inputKey),
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col items-center gap-2 w-full"
    >
      <div className="w-full space-y-4 overflow-y-auto bg-base-200 max-h-[240px] mb-4 rounded-2xl">
        {requirements.map((requirement) => {
          const matchingCredentials = credentials.filter((cred) =>
            cred.matchingRequirements.some(
              (req) => req.inputKey === requirement.inputKey,
            ),
          )

          return (
            <div key={requirement.inputKey} className="space-y-2">
              <h3 className="text-sm font-medium pt-1 pl-1">
                Select credential for {requirement.inputKey}:
              </h3>
              <div className="flex flex-col gap-2 bg-base-100 p-2 rounded-2xl">
                {matchingCredentials.length > 0 ? (
                  matchingCredentials.map((credentialData) => (
                    <label
                      key={`${credentialData.id}-${requirement.inputKey}`}
                      className="flex items-center gap-2 p-3 rounded-2xl bg-base-100 cursor-pointer hover:bg-base-300 transition-colors"
                    >
                      <input
                        type="radio"
                        name={requirement.inputKey}
                        className="radio radio-xs"
                        checked={isSelectedFor(
                          credentialData.id,
                          requirement.inputKey,
                        )}
                        onChange={() =>
                          handleCredentialSelect(
                            credentialData,
                            requirement.inputKey,
                          )
                        }
                        disabled={loading}
                      />
                      <CredentialDisplay
                        credential={credentialData.credential}
                        matchingRequirements={
                          credentialData.matchingRequirements
                        }
                      />
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-sm text-neutral-500 text-center">
                    No matching credentials found for this input
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full"
        disabled={loading || !allRequirementsMet}
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
