export function showUserPrompt(
  inputType: "text" | "password" | "confirmation",
  metadata: { title: string; payload?: string },
) {
  return new Promise((resolve) => {
    chrome.windows
      .create({
        url: "prompt.html",
        type: "popup",
        width: 371,
        height: 600,
        state: "normal",
      })
      .then(async (newWindow) => {
        const listener = (response: any) => {
          if (response.windowId === newWindow?.id) {
            chrome.runtime.onMessage.removeListener(listener)
            if (response.userRejected) {
              resolve(null) // User cancelled the prompt
            } else if (inputType === "confirmation") {
              resolve(response.userConfirmed) // Confirmation response (true/false)
            } else {
              resolve(response.userInput) // User provided text/password input
            }
          }
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
            console.error("Failed to retrieve tab ID")
            resolve(null)
          }
        } else {
          console.error("Failed to create prompt window")
          resolve(null)
        }
      })
  })
}
