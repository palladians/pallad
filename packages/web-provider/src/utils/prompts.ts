type InputType = "text" | "password" | "confirmation" | "selection"
type Metadata = {
  title: string
  submitButtonLabel?: string
  rejectButtonLabel?: string
  payload?: string
}

type ContractResult = {
  type?: string
  result?: string
  error?: string
}

type PromptResult<T> = {
  value: T
  result?: ContractResult
}

export const showUserPrompt = async <T extends boolean | string = boolean>({
  inputType,
  metadata,
  contract,
  emitConnected = false,
}: {
  inputType: InputType
  metadata: Metadata
  contract?: string
  emitConnected?: boolean
}): Promise<PromptResult<T>> => {
  return new Promise<PromptResult<T>>((resolve, reject) => {
    chrome.windows
      .create({
        url: "prompt.html",
        type: "popup",
        width: 480,
        height: 772,
        state: "normal",
      })
      .then(async (newWindow) => {
        const listener = (response: any) => {
          if (response.windowId === newWindow?.id) {
            chrome.runtime.onMessage.removeListener(listener)
            if (response.userRejected) {
              return reject(new Error("4001 - User Rejected Request"))
            }
            if (inputType === "confirmation") {
              if (response.userConfirmed) {
                return resolve({
                  value: true as T,
                  result: response.result,
                })
              }
              return reject(new Error("4001 - User Rejected Request"))
            }
            console.log(
              `in event handler - response: ${JSON.stringify(response)}`,
            )
            if (response.userInput.length > 0) {
              return resolve({
                value: response.userInput,
                result: response.result,
              })
            }
            return reject(new Error("4100 - Unauthorized"))
          }
          return reject(new Error("Wrong window context"))
        }
        if (newWindow?.tabs && newWindow.tabs.length > 0) {
          const tabId = newWindow.tabs?.[0]?.id
          if (typeof tabId === "number") {
            setTimeout(() => {
              chrome.runtime.sendMessage({
                type: "action_request",
                params: {
                  title: metadata.title,
                  submitButtonLabel: metadata.submitButtonLabel,
                  rejectButtonLabel: metadata.rejectButtonLabel,
                  payload: metadata.payload ?? "{}",
                  inputType,
                  contract,
                  emitConnected,
                },
              })
            }, 1000)
            chrome.runtime.onMessage.addListener(listener)
            const closeListener = (closedWindowId: number) => {
              chrome.windows.onRemoved.removeListener(closeListener)
              if (closedWindowId === newWindow?.id) {
                return reject(new Error("4001 - User Rejected Request"))
              }
            }
            chrome.windows.onRemoved.addListener(closeListener)
          } else {
            return reject(new Error("Failed to retrieve tab ID"))
          }
        } else {
          return reject(new Error("Failed to create prompt window"))
        }
      })
  })
}
