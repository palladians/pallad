import { Credential } from "mina-credentials"
import { match } from "ts-pattern"
import { z } from "zod"

// TODO: for now leave it hear but later move to separate package
async function validateCredential(credential: string): Promise<string> {
  const credentialDeserialized = Credential.fromJSON(credential)
  await Credential.validate(credentialDeserialized)
  return Credential.toJSON(credentialDeserialized)
}

const EventTypeSchema = z.enum(["validate-credential"])

type ValidationResult = {
  type: "validate-credential-result"
  success: boolean
  credential?: string
  error?: string
}

window.addEventListener("message", async (event) => {
  console.log(event.data)
  const type = EventTypeSchema.parse(event.data.type)
  return match(type)
    .with("validate-credential", async () => {
      try {
        const credentialInput = event.data.credential

        const validatedCredential = await validateCredential(credentialInput)

        const result: ValidationResult = {
          type: "validate-credential-result",
          success: true,
          credential: validatedCredential,
        }

        window.parent.postMessage(result, "*")
      } catch (error: any) {
        const result: ValidationResult = {
          type: "validate-credential-result",
          success: false,
          error: error instanceof Error ? error.message : "Validation Error",
        }
        window.parent.postMessage(result, "*")
      }
    })
    .exhaustive()
})
