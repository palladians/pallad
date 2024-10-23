import { useEffect, useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { MemoryRouter } from "react-router-dom"
import { sendMessage } from "webext-bridge/popup"
import { runtime, windows } from "webextension-polyfill"
import xss from "xss"
import yaml from "yaml"
import type { UserInputForm } from "../types"
import { WebConnectorView } from "../views/web-connector"

const sanitizePayload = async (payload: string) => {
  const parsedPayload = JSON.parse(payload) as Record<string, any>
  const yamlPayload = yaml.stringify(parsedPayload)
  return xss(yamlPayload)
}

type ActionRequest = {
  title: string
  submitButtonLabel?: string
  rejectButtonLabel?: string
  payload: string
  inputType: "text" | "password" | "confirmation"
  loading: boolean
  emitConnected: boolean
}

export const WebConnectorRoute = () => {
  const [request, setRequest] = useState<ActionRequest>({
    title: "",
    payload: "",
    inputType: "confirmation",
    loading: true,
    emitConnected: false,
  })
  const onSubmit: SubmitHandler<UserInputForm> = async ({ userInput }) => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userInput,
      windowId: id,
    })
    window.close()
  }
  const confirm = async () => {
    const { id } = await windows.getCurrent()
    await runtime.sendMessage({
      userConfirmed: true,
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
  useEffect(() => {
    runtime.onMessage.addListener(async (message) => {
      if (message.type === "action_request") {
        setRequest({
          title: message.params.title,
          submitButtonLabel: message.params.submitButtonLabel,
          rejectButtonLabel: message.params.rejectButtonLabel,
          payload: await sanitizePayload(message.params.payload),
          inputType: message.params.inputType,
          loading: false,
          emitConnected: message.params.emitConnected,
        })
      }
    })
  }, [])
  return (
    <MemoryRouter>
      <WebConnectorView
        inputType={request.inputType}
        onConfirm={confirm}
        onDecline={decline}
        rejectButtonLabel={request.rejectButtonLabel}
        onReject={reject}
        submitButtonLabel={request.submitButtonLabel}
        onSubmit={onSubmit}
        title={request.title}
        payload={request.payload}
        loading={request.loading}
      />
    </MemoryRouter>
  )
}
