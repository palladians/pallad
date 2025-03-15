import {
  type PresentationRequestJSON,
  PrettyPrinter,
  type StoredCredentialJSON,
} from "mina-attestations/validation"
import xss from "xss"
import { recoverOriginalPayload } from "../components/credential-selection-form"

const handleRenderError = (error: Error) => {
  const sanitizedError = xss(error.message)

  return (
    <pre className="whitespace-pre-wrap break-all">
      {`Error: ${sanitizedError}`}
    </pre>
  )
}

const containsPresentationRequest = (
  value: unknown,
): value is {
  presentationRequest: PresentationRequestJSON
  verifierIdentity:
    | string
    | { address: string; tokenId: string; network: "devnet" | "mainnet" }
} => {
  if (typeof value !== "object" || value === null) return false
  return "presentationRequest" in value
}

const isCredential = (
  value: unknown,
): value is StoredCredentialJSON & { metadata?: { description: string } } => {
  if (typeof value !== "object" || value === null) return false
  return "credential" in value
}

export const renderPayload = (payload: string) => {
  try {
    const originalPayload = recoverOriginalPayload(payload)
    const parsedPayload = JSON.parse(originalPayload)

    // Handle presentation request format
    if (containsPresentationRequest(parsedPayload)) {
      const request = parsedPayload.presentationRequest
      const formatted = [
        PrettyPrinter.printPresentationRequest(request),
        PrettyPrinter.printVerifierIdentity(
          request.type as any, // TODO
          parsedPayload.verifierIdentity,
        ),
      ].join("\n")

      return <div className="whitespace-pre-wrap break-all">{formatted}</div>
    }

    // Handle credential format
    if (isCredential(parsedPayload)) {
      const simplifiedData = PrettyPrinter.simplifyCredentialData(parsedPayload)
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

    // Default fallback
    return <pre className="whitespace-pre-wrap break-all">{payload}</pre>
  } catch (error) {
    if (error instanceof Error) {
      return handleRenderError(error)
    }
    // This case should never occur given the error sources
    return (
      <pre className="whitespace-pre-wrap break-all">
        Error: Unexpected render error
      </pre>
    )
  }
}
