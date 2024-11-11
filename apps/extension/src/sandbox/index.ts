import { Add } from "@palladco/contracts"
import { Credential } from "mina-credentials"
import { match } from "ts-pattern"
import { z } from "zod"

const EventTypeSchema = z.enum(["run"])
const ContractTypeSchema = z.enum(["add", "validate-credential"])

type ValidationResult = {
  type: "validate-credential-result"
  success: boolean
  credential?: string
  error?: string
}

window.addEventListener("message", async (event) => {
  console.log(event.data)
  const type = EventTypeSchema.parse(event.data.type)
  const contract = ContractTypeSchema.parse(event.data.contract)

  return match(type)
    .with("run", async () => {
      return match(contract)
        .with("add", async () => {
          await Add.compile()
          window.parent.postMessage(
            {
              type: "compiled",
              result: "test",
              userInput: event.data.userInput,
            },
            "*",
          )
        })
        .with("validate-credential", async () => {
          try {
            const credentialInput = event.data.payload
            const credentialDeserialized = Credential.fromJSON(credentialInput)
            await Credential.validate(credentialDeserialized)

            // Use the existing ValidationResult type structure
            const result: ValidationResult = {
              type: "validate-credential-result",
              success: true,
              credential: Credential.toJSON(credentialDeserialized),
            }

            window.parent.postMessage(result, "*")
          } catch (error: any) {
            const result: ValidationResult = {
              type: "validate-credential-result",
              success: false,
              error:
                error instanceof Error ? error.message : "Validation Error",
            }
            window.parent.postMessage(result, "*")
          }
        })
    })
    .exhaustive()
})
