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

const sanitizePayload = async (payload: string) => {
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
  inputType: "text" | "password" | "confirmation"
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
    UserInputForm & { contractResult?: ContractResult }
  > = async ({ userInput, contractResult }) => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userInput,
      contractResult,
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
  const confirm = async ({
    contractResult,
  }: { contractResult?: ContractResult }) => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userConfirmed: true,
      contractResult,
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
  const eventListener = (event: MessageEvent) => {
    if (event.data.type === "validate-credential-result") {
      return confirm({
        contractResult: {
          type: event.data.type,
          result: event.data.result,
          error: event.data.error,
        },
      })
    }
    if (request.inputType === "confirmation")
      return confirm({ contractResult: event.data.result })
    return onSubmit({
      userInput: event.data.userInput,
      contractResult: event.data.result,
    })
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: wontdo
  useEffect(() => {
    window.addEventListener("message", eventListener)
    return () => {
      window.removeEventListener("message", eventListener)
    }
  }, [])
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
