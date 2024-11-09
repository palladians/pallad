export const validateCredential = async (message: any) => {
  try {
    // Forward the validation request to sandbox
    const response = await chrome.runtime.sendMessage({
      type: "validate-credential",
      credential: message.data.credential,
    })

    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
