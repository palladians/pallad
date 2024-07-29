import DOMPurify from "isomorphic-dompurify"
import { useEffect, useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { MemoryRouter } from "react-router-dom"
import { highlight } from "sugar-high"
import { runtime } from "webextension-polyfill"
import yaml from "yaml"
import type { UserInputForm } from "../types"
import { WebConnectorView } from "../views/web-connector"

const sanitizePayload = (payload: string) => {
  const parsedPayload = JSON.parse(payload) as Record<string, any>
  const yamlPayload = yaml.stringify(parsedPayload)
  return DOMPurify.sanitize(highlight(yamlPayload))
}

type ActionRequest = {
  title: string
  payload: string
  inputType: "text" | "password" | "confirmation"
  loading: boolean
}

export const WebConnectorRoute = () => {
  const [request, setRequest] = useState<ActionRequest>({
    title: "",
    payload: "",
    inputType: "confirmation",
    loading: true,
  })
  const onSubmit: SubmitHandler<UserInputForm> = async ({ userInput }) => {
    const { id } = await chrome.windows.getCurrent()
    await runtime.sendMessage({
      userInput,
      windowId: id,
    })
    window.close()
  }
  const confirm = async () => {
    const { id } = await chrome.windows.getCurrent()
    await runtime.sendMessage({
      userConfirmed: true,
      windowId: id,
    })
    window.close()
  }
  const decline = async () => {
    const { id } = await chrome.windows.getCurrent()
    await runtime.sendMessage({
      userConfirmed: false,
      windowId: id,
    })
    window.close()
  }
  const reject = async () => {
    const { id } = await chrome.windows.getCurrent()
    await runtime.sendMessage({
      userRejected: true,
      windowId: id,
    })
    window.close()
  }
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "action_request") {
        setRequest({
          title: message.params.title,
          payload: sanitizePayload(message.params.payload),
          inputType: message.params.inputType,
          loading: false,
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
        onReject={reject}
        onSubmit={onSubmit}
        title={request.title}
        payload={request.payload}
        loading={request.loading}
      />
    </MemoryRouter>
  )
}
