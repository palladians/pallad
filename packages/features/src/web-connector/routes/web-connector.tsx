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
  const parsedPayload = payload
    ? (JSON.parse(payload) as Record<string, any>)
    : {}
  const yamlPayload = yaml.stringify(parsedPayload) ?? ""
  const userFriendlyPayload = DOMPurify.sanitize(highlight(yamlPayload))
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
