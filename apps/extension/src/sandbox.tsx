import { Credential } from "mina-credentials"
import { useEffect } from "react"
import { onMessage } from "webext-bridge/window"

const CredentialValidator = () => {
  useEffect(() => {
    // Listen for validation requests from background
    const unsubscribe = onMessage("validate-credential", async (message) => {
      try {
        console.log("Validating credential in sandbox...")
        const credential = message.data

        // Parse and validate the credential
        const credentialDeserialized = Credential.fromJSON(
          JSON.stringify(credential),
        )
        await Credential.validate(credentialDeserialized)
        const credentialSerialized = Credential.toJSON(credentialDeserialized)

        // Send result back to background
        return {
          success: true,
          credential: credentialSerialized,
        }
      } catch (error) {
        console.error("Validation error:", error)
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}

export default CredentialValidator
