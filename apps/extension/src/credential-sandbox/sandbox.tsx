import { Credential } from "mina-credentials"
import { useEffect } from "react"

interface ValidationRequest {
  type: "validate-credential"
  credential: unknown
}

// interface ValidationResponse {
//   type: 'credential-validation-result'
//   success: boolean
//   credential?: string
//   error?: string
// }

const Sandbox = () => {
  useEffect(() => {
    const handleMessage = async (event: MessageEvent<ValidationRequest>) => {
      if (event.data.type !== "validate-credential") return

      try {
        // Parse and validate the credential
        const credential = Credential.fromJSON(
          JSON.stringify(event.data.credential),
        )
        await Credential.validate(credential)

        // If validation succeeds, serialize the validated credential
        const serializedCredential = Credential.toJSON(credential)

        window.parent.postMessage(
          {
            type: "credential-validation-result",
            success: true,
            credential: serializedCredential,
          },
          "*",
        )
      } catch (error) {
        window.parent.postMessage(
          {
            type: "credential-validation-result",
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Unknown validation error",
          },
          "*",
        )
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return null
}

export default Sandbox
