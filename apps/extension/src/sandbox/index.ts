import { Credential, Presentation, PresentationRequest } from "mina-credentials"
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

type PresentationRequestPayload = {
  presentationRequest: string
  selectedCredentials: string[]
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
            try {
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

              const originalPayload = recoverOriginalPayload(msg.payload)

              const parsedPayload = JSON.parse(
                originalPayload,
              ) as PresentationRequestPayload

              const { presentationRequest, selectedCredentials } = parsedPayload

              const stringifiedPresentationRequest =
                JSON.stringify(presentationRequest)

              const storedCredentials = selectedCredentials.map(
                (credential) => {
                  return Credential.fromJSON(JSON.stringify(credential))
                },
              )

              const parsedPresentationRequest = JSON.parse(
                stringifiedPresentationRequest,
              ) as PresentationRequest
              const requestType = parsedPresentationRequest.type

              const deserialized = PresentationRequest.fromJSON(
                requestType,
                stringifiedPresentationRequest,
              )
              const compiled = await Presentation.compile(deserialized)

              // TODO: delete later, only here to not get unused errors
              console.log(compiled)
              console.log(signature)
              console.log(storedCredentials)

              const mockResult: Result = {
                type: "presentation-result",
                result: "works so far",
              }

              window.parent.postMessage(mockResult, "*")
            } catch (error: any) {
              const result: Result = {
                type: "presentation-result",
                error: serializeError(error),
              }
              window.parent.postMessage(result, "*")
            }
          })
          .exhaustive()
      })
      .exhaustive()
  } catch (error: any) {
    throw Error(`Sandbox Error: ${error}`)
  }
})
