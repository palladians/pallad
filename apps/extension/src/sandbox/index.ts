import { Credential } from "mina-credentials"
import { serializeError } from "serialize-error"
import { match } from "ts-pattern"
import yaml from "yaml"
import { z } from "zod"

const MessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("run"),
    contract: z.enum(["validate-credential", "presentation"]),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("presentation-signature"),
    signature: z.string(),
  }),
  z.object({
    type: z.literal("presentation-signature-error"),
    error: z.string(),
  }),
])

type Result = {
  type: string
  result?: string
  error?: string
}

const recoverOriginalPayload = (sanitizedPayload: string) => {
  const parsedYaml = yaml.parse(sanitizedPayload)
  return JSON.stringify(parsedYaml)
}

let presentationSignaturePromise: {
  resolve: (value: any) => void
  reject: (reason: any) => void
} | null = null

window.addEventListener("message", async (event) => {
  console.log(event.data)
  try {
    const message = MessageSchema.parse(event.data)

    if (message.type === "presentation-signature") {
      if (presentationSignaturePromise) {
        presentationSignaturePromise.resolve(message.signature)
        presentationSignaturePromise = null
      }
      return
    }

    if (message.type === "presentation-signature-error") {
      if (presentationSignaturePromise) {
        presentationSignaturePromise.reject(new Error(message.error))
        presentationSignaturePromise = null
      }
      return
    }

    return match(message)
      .with({ type: "run" }, async (msg) => {
        return match(msg.contract)
          .with("validate-credential", async () => {
            try {
              const sanitizedPayload = msg.payload
              const originalPayload = recoverOriginalPayload(sanitizedPayload)
              const credentialDeserialized =
                Credential.fromJSON(originalPayload)
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
            const mockFieldsToSign = [
              "15194438335254979123992673494772742932886141479807135737958843785282001151979",
              "13058445919007356413345300070030973942059862825965583483176167800381508277987",
              "26067489438851605530938171293652363087823200555042082718868551789908955769071",
            ]

            window.parent.postMessage(
              {
                type: "presentation-signing-request",
                fields: mockFieldsToSign,
              },
              "*",
            )

            const signature = await new Promise((resolve, reject) => {
              presentationSignaturePromise = { resolve, reject }
            })

            const mockResult: Result = {
              type: "presentation-result",
              result: JSON.stringify(signature),
            }

            window.parent.postMessage(mockResult, "*")
          })
          .exhaustive()
      })
      .exhaustive()
  } catch (error: any) {
    throw Error(`Sandbox Error: ${error}`)
  }
})
