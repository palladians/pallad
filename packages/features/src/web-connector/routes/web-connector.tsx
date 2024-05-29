import DOMPurify from "dompurify"
import type { SubmitHandler } from "react-hook-form"
import { MemoryRouter } from "react-router-dom"
import { highlight } from "sugar-high"
import { runtime } from "webextension-polyfill"
import yaml from "yaml"
import type { UserInputForm } from "../types"
import { WebConnectorView } from "../views/web-connector"

export const WebConnectorRoute = () => {
  const params = new URLSearchParams(window.location.search)
  const title = params.get("title") ?? ""
  const payload = params.get("payload") ?? ""
  const inputType = params.get("inputType")
  const rawWindowId = params.get("windowId")
  const windowId = Number.parseInt(rawWindowId ?? "")
  const onSubmit: SubmitHandler<UserInputForm> = async ({ userInput }) => {
    await runtime.sendMessage({
      windowId: windowId,
      userInput,
    })
    window.close()
  }
  const confirm = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userConfirmed: true,
    })
    window.close()
  }
  const decline = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userConfirmed: false,
    })
    window.close()
  }
  const reject = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userRejected: true,
    })
    window.close()
  }
  const parsedPayload = JSON.parse(payload) as Record<string, any>
  const yamlPayload = yaml.stringify(parsedPayload.data) ?? ""
  const userFriendlyPayload = DOMPurify.sanitize(highlight(yamlPayload))
  if (!rawWindowId) return null
  if (!inputType) return null
  return (
    <MemoryRouter>
      <WebConnectorView
        inputType={inputType}
        onConfirm={confirm}
        onDecline={decline}
        onReject={reject}
        onSubmit={onSubmit}
        title={title}
        payload={userFriendlyPayload}
      />
    </MemoryRouter>
  )
}
