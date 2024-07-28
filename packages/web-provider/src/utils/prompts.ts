export const showUserPrompt = async (
  inputType: "text" | "password" | "confirmation",
  metadata: { title: string; payload?: string },
) => {
  return new Promise((resolve, reject) => {
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
              if (response.userConfirmed) return resolve(true)
              return reject(new Error("4001 - User Rejected Request"))
            }
            if (response.userInput.length > 0)
              return resolve(response.userInput)
            return reject(new Error("4100 - Unauthorized"))
          }
          return reject(new Error("Wrong window context"))
        }
        if (newWindow?.tabs && newWindow.tabs.length > 0) {
          // Ensure newWindow and newWindow.tabs are defined and not empty
          const tabId = newWindow.tabs?.[0]?.id!
          if (typeof tabId === "number") {
            // If tabId is a number, construct the full URL and update the tab
            const fullUrl = `prompt.html?title=${encodeURIComponent(
              metadata.title,
            )}&payload=${encodeURIComponent(
              metadata.payload ?? "",
            )}&inputType=${inputType}&windowId=${newWindow.id}`
            await chrome.tabs.update(tabId, { url: fullUrl })
            chrome.runtime.onMessage.addListener(listener)
          } else {
            return reject(new Error("Failed to retrieve tab ID"))
          }
        } else {
          return reject(new Error("Failed to create prompt window"))
        }
      })
  })
}
