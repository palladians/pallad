import { Credential } from "mina-credentials"
import { serializeError } from "serialize-error"
import { match } from "ts-pattern"
import yaml from "yaml"
import { z } from "zod"

const EventTypeSchema = z.enum(["run"])
const ContractTypeSchema = z.enum(["validate-credential", "presentation"])

type Result = {
  type: string
  result?: string
  error?: string
}

const recoverOriginalPayload = (sanitizedPayload: string) => {
  const parsedYaml = yaml.parse(sanitizedPayload)
  return JSON.stringify(parsedYaml)
}

window.addEventListener("message", async (event) => {
  console.log(event.data)
  const type = EventTypeSchema.parse(event.data.type)
  const contract = ContractTypeSchema.parse(event.data.contract)

  return match(type)
    .with("run", async () => {
      return match(contract)
        .with("validate-credential", async () => {
          try {
            const sanitizedPayload = event.data.payload
            const originalPayload = recoverOriginalPayload(sanitizedPayload)
            const credentialDeserialized = Credential.fromJSON(originalPayload)
            await Credential.validate(credentialDeserialized)

            const result: Result = {
              type: "validate-credential-result",
              result: Credential.toJSON(credentialDeserialized),
            }

            window.parent.postMessage(result, "*")
          } catch (error: any) {
            const result: Result = {
              type: "validate-credential-result",
              error: serializeError(error),
            }
            window.parent.postMessage(result, "*")
          }
        })
        .with("presentation", async () => {
          // try {
          //   // TODO: create presentation
          //   const result: Result = {
          //     type: "presentation-result",
          //     result: serializedPresentation,
          //   }
          //   window.parent.postMessage(result, "*")
          // } catch (error: any) {
          //   const result: Result = {
          //     type: "presentation-result",
          //     error: serializeError(error),
          //   }
          //   window.parent.postMessage(result, "*")
          // }
        })
        .exhaustive()
    })
    .exhaustive()
})
