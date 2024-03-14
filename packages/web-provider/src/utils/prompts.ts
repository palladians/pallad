/*export async function showUserPrompt(
  message: string,
  inputType: 'text' | 'password' = 'text'
): Promise<string | null> {
  // Modified return type to include null
  // TODO: figure out if we need to add "types": ["chrome"] to tsconfig.json?
  // should add the following to the extension app next to background.js, manifest.json, etc.
  // ├── prompt.html         // Your custom prompt HTML page
  // ├── prompt.js           // JavaScript for prompt.html
  // ├── prompt.css          // CSS for prompt.html
  // Create a new window with your custom HTML page for the prompt
  return new Promise((resolve) => {
    console.log('User Prompt Message:', message)

    chrome.windows.create(
      {
        url: `prompt.html?message=${encodeURIComponent(
          message
        )}&inputType=${inputType}`,
        type: 'popup'
      },
      (newWindow) => {
        // Check if newWindow is defined
        if (newWindow) {
          chrome.runtime.onMessage.addListener(function listener(response) {
            if (response.windowId === newWindow.id) {
              if (response.userRejected) {
                resolve(null) // Keep this as null or change as per your requirements
              } else {
                resolve(response.userInput) // User provided input
              }
              chrome.runtime.onMessage.removeListener(listener)
            }
          })
        } else {
          // Handle the case where the window could not be created
          console.error('Failed to create prompt window')
          resolve(null) // Resolve with null or a default value
        }
      }
    )
  })
}*/

export async function showUserPrompt(
  message: string,
  inputType: 'text' | 'password' | 'confirmation' = 'text'
): Promise<string | boolean | null> {
  console.log('User Prompt Message:', message)

  return new Promise((resolve) => {
    chrome.windows.create(
      {
        url: 'prompt.html', // Initial placeholder URL
        type: 'popup'
      },
      async (newWindow) => {
        const listener = (response: any) => {
          if (response.windowId === newWindow?.id) {
            chrome.runtime.onMessage.removeListener(listener)
            if (response.userRejected) {
              resolve(null) // User cancelled the prompt
            } else if (inputType === 'confirmation') {
              resolve(response.userConfirmed) // Confirmation response (true/false)
            } else {
              resolve(response.userInput) // User provided text/password input
            }
          }
        }
        if (newWindow && newWindow.tabs && newWindow.tabs.length > 0) {
          // Ensure newWindow and newWindow.tabs are defined and not empty
          const tabId = newWindow.tabs![0]!.id!
          if (typeof tabId === 'number') {
            // If tabId is a number, construct the full URL and update the tab
            const fullUrl = `prompt.html?message=${encodeURIComponent(
              message
            )}&inputType=${inputType}&windowId=${newWindow.id}`
            await chrome.tabs.update(tabId, { url: fullUrl })
            chrome.runtime.onMessage.addListener(listener)
          } else {
            console.error('Failed to retrieve tab ID')
            resolve(null)
          }
        } else {
          console.error('Failed to create prompt window')
          resolve(null)
        }
      }
    )
  })
}
