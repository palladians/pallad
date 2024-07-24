export function showUserPrompt(
  inputType: "text" | "password" | "confirmation",
  metadata: { title: string; payload?: string },
) {
  return new Promise((resolve) => {
    const fullUrl = `prompt.html?title=${encodeURIComponent(
      metadata.title,
    )}&payload=${encodeURIComponent(
      metadata.payload ?? "",
    )}&inputType=${inputType}`
    chrome.sidePanel
      .setOptions({
        path: fullUrl,
        enabled: true,
      })
      .then(async () => {
        const listener = (response: any) => {
          chrome.runtime.onMessage.removeListener(listener)
          if (response.userRejected) {
            resolve(null) // User cancelled the prompt
          } else if (inputType === "confirmation") {
            resolve(response.userConfirmed) // Confirmation response (true/false)
          } else {
            resolve(response.userInput) // User provided text/password input
          }
        }
        chrome.runtime.onMessage.addListener(listener)
      })
  })
}
