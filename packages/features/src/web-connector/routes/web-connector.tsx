import type { Json } from "@mina-js/utils"
import { useEffect, useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { MemoryRouter } from "react-router-dom"
import { sendMessage } from "webext-bridge/popup"
import { runtime, windows } from "webextension-polyfill"
import xss from "xss"
import yaml from "yaml"
import type { UserInputForm } from "../types"
import { WebConnectorView } from "../views/web-connector"

type ContractResult = {
  type?: string
  result?: string
  error?: string
}

type SignedFieldsResponse = {
  data: string[]
  publicKey: string
  signature: string
}

export const sanitizePayload = async (payload: string) => {
  const parsedPayload = JSON.parse(payload) as Record<string, any>
  const yamlPayload = yaml.stringify(parsedPayload)
  return xss(yamlPayload)
}

const sendSandboxMessage = (payload: Json) => {
  const sandbox = document.querySelector(
    "#o1sandbox",
  ) as HTMLIFrameElement | null
  if (!sandbox) return
  return sandbox.contentWindow?.postMessage(payload, "*")
}

type ActionRequest = {
  title: string
  submitButtonLabel?: string
  rejectButtonLabel?: string
  payload: string
  inputType: "text" | "password" | "confirmation" | "selection"
  contract: string | undefined
  emitConnected: boolean
}

export const WebConnectorRoute = () => {
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState<ActionRequest>({
    title: "",
    payload: "",
    inputType: "confirmation",
    contract: undefined,
    emitConnected: false,
  })
  const startSubmitting: SubmitHandler<UserInputForm> = async ({
    userInput,
  }) => {
    if (!request.contract) return onSubmit({ userInput })
    setLoading(true)
    try {
      // For presentation contract, set up message handler for signing request
      if (request.contract === "presentation") {
        const messageHandler = async (event: MessageEvent) => {
          if (event.data.type === "presentation-signing-request") {
            try {
              // Use the passphrase we already have to sign fields
              const response = (await sendMessage(
                "mina_signFieldsWithPassphrase",
                {
                  params: [
                    {
                      fields: event.data.fields,
                      passphrase: userInput,
                    },
                  ],
                  context: {
                    origin: `chrome-extension://${chrome.runtime.id}`,
                  },
                },
                "background",
              )) as SignedFieldsResponse

              if (!response || !response.signature) {
                throw new Error(
                  `Failed to sign fields; response: ${JSON.stringify(response)}`,
                )
              }

              // Send signature back to sandbox
              sendSandboxMessage({
                type: "presentation-signature",
                signature: response.signature,
              })
            } catch (error) {
              console.error("Error signing fields:", error)
              sendSandboxMessage({
                type: "presentation-signature-error",
                error: error instanceof Error ? error.message : "Unknown error",
              })
            }
          }
        }

        window.addEventListener("message", messageHandler)
      }
      return sendSandboxMessage({
        type: "run",
        contract: request.contract,
        payload: request.payload,
        userInput,
      })
    } finally {
      setLoading(false)
    }
  }
  const onSubmit: SubmitHandler<
    UserInputForm & { result?: ContractResult }
  > = async ({ userInput, result }) => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userInput,
      result,
      windowId: id,
    })
    window.close()
  }
  const startConfirming = async () => {
    if (!request.contract) return confirm({})
    setLoading(true)
    try {
      return sendSandboxMessage({
        type: "run",
        contract: request.contract,
        payload: request.payload,
      })
    } finally {
      setLoading(false)
    }
  }
  const confirm = async ({ result }: { result?: ContractResult }) => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userConfirmed: true,
      result,
      windowId: id,
    })
    if (request.emitConnected) {
      await sendMessage("pallad_connected", {}, "background")
    }
    window.close()
  }
  const decline = async () => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userConfirmed: false,
      windowId: id,
    })
    window.close()
  }
  const reject = async () => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userRejected: true,
      windowId: id,
    })
    window.close()
  }
  const eventListener = async (event: MessageEvent) => {
    if (event.data.type === "presentation-result") {
      return onSubmit({
        userInput: "passphrase", // TODO: userInput out of scope
        result: {
          type: event.data.type,
          result: event.data.result,
          error: event.data.error,
        },
      })
    }
    if (event.data.type === "validate-credential-result") {
      return confirm({
        result: {
          type: event.data.type,
          result: event.data.result,
          error: event.data.error,
        },
      })
    }
    if (request.inputType === "confirmation")
      return confirm({ result: event.data.result })
    return onSubmit({
      userInput: event.data.userInput,
      result: event.data.result,
    })
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: wontdo
  useEffect(() => {
    window.addEventListener("message", eventListener)
    return () => {
      window.removeEventListener("message", eventListener)
    }
  }, [request.inputType])
  useEffect(() => {
    runtime.onMessage.addListener(async (message) => {
      if (message.type === "action_request") {
        setRequest({
          title: message.params.title,
          submitButtonLabel: message.params.submitButtonLabel,
          rejectButtonLabel: message.params.rejectButtonLabel,
          payload: await sanitizePayload(message.params.payload),
          contract: message.params.contract,
          inputType: message.params.inputType,
          emitConnected: message.params.emitConnected,
        })
        setLoading(false)
      }
    })
  }, [])
  return (
    <MemoryRouter>
      <WebConnectorView
        inputType={request.inputType}
        onConfirm={startConfirming}
        onDecline={decline}
        rejectButtonLabel={request.rejectButtonLabel}
        onReject={reject}
        submitButtonLabel={request.submitButtonLabel}
        onSubmit={startSubmitting}
        title={request.title}
        payload={request.payload}
        loading={loading}
      />
    </MemoryRouter>
  )
}
