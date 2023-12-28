export async function showUserPrompt(
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
}
