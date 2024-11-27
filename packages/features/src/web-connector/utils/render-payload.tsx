import { recoverOriginalPayload } from "../components/credential-selection-form"

const isCredential = (value: unknown): value is Record<string, any> => {
  if (typeof value !== "object" || value === null) return false

  // TODO: check
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

export const renderPayload = (payload: string) => {
  try {
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
  } catch (error) {
    return (
      <pre className="whitespace-pre-wrap break-all">{`Error: ${error}`}</pre>
    )
  }
}
