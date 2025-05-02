import {
  Credential,
  Presentation,
  PresentationRequest,
} from "mina-attestations"
import { Signature } from "o1js"
import { serializeError } from "serialize-error"
import { match } from "ts-pattern"
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
  presentationRequest: PresentationRequest
  selectedCredentials: string[]
  verifierIdentity:
    | string
    | {
        address: string
        tokenId: string
        network: "devnet" | "mainnet"
      }
}

let presentationSignaturePromise: {
  resolve: (value: any) => void
  reject: (reason: any) => void
} | null = null

let allowedOrigin: string | null = null

window.addEventListener("message", async (event) => {
  if (event.data.type === "init") {
    allowedOrigin = `chrome-extension://${event.data.extensionId}`
    return
  }

  if (!allowedOrigin) {
    window.parent.postMessage(
      {
        type: `${event.data?.contract}-result`,
        error: "allowedOrigin is not set",
      },
      "*",
    )
    return
  }
  if (event.origin !== allowedOrigin) {
    window.parent.postMessage(
      {
        type: `${event.data?.contract}-result`,
        error: `Invalid origin: ${event.origin}`,
      },
      "*",
    )
    return
  }

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
            const payload = msg.payload
            const credentialDeserialized = await Credential.fromJSON(payload)

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
            // get back original payload
            const payload = msg.payload

            // parse payload as PresentationRequestPayload
            const parsedPayload = JSON.parse(
              payload,
            ) as PresentationRequestPayload

            const {
              presentationRequest,
              selectedCredentials,
              verifierIdentity,
            } = parsedPayload

            const stringifiedPresentationRequest =
              JSON.stringify(presentationRequest)

            // create mina-credentials StoredCredential[] from selectedCredentials
            const storedCredentials = []
            for (const credential of selectedCredentials) {
              const stored = await Credential.fromJSON(
                JSON.stringify(credential),
              )
              storedCredentials.push(stored)
            }

            // deserialize presentation request
            const deserialized = PresentationRequest.fromJSON(
              presentationRequest.type,
              stringifiedPresentationRequest,
            )

            // format verifierIdentity
            const verifierIdentityString =
              presentationRequest.type === "zk-app"
                ? JSON.stringify(verifierIdentity)
                : (verifierIdentity as string)

            // TODO: cache compiled presentation request?

            // prepare presentation request and get fields to sign
            const prepared = await Presentation.prepare({
              request: deserialized,
              credentials: storedCredentials,
              context: { verifierIdentity: verifierIdentityString },
            })

            // ask wallet to sign fields
            window.parent.postMessage(
              {
                type: "presentation-signing-request",
                fields: prepared.messageFields,
              },
              "*",
            )

            // get signature from wallet
            const signature = (await new Promise((resolve, reject) => {
              presentationSignaturePromise = { resolve, reject }
            })) as string

            // get o1js Signature type signature
            const ownerSignature = Signature.fromBase58(signature)

            // finalize presentation
            const presentation = await Presentation.finalize(
              deserialized,
              ownerSignature,
              prepared,
            )

            // serialize presentation
            const serializedPresentation = Presentation.toJSON(presentation)

            const result: Result = {
              type: "presentation-result",
              result: serializedPresentation,
            }
            window.parent.postMessage(result, "*")
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
})
