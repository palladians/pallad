import type { ValidationResult } from "./types"

export class CredentialValidator {
  private static instance: CredentialValidator
  private sandboxFrame: HTMLIFrameElement | null = null
  private readonly sandboxUrl: string
  private readonly validationTimeout = 10000 // 10 second timeout

  private constructor(sandboxUrl: string) {
    this.sandboxUrl = sandboxUrl
  }

  static initialize(sandboxUrl: string) {
    if (!CredentialValidator.instance) {
      CredentialValidator.instance = new CredentialValidator(sandboxUrl)
    }
    return CredentialValidator.instance
  }

  async validateCredential(credential: unknown): Promise<string> {
    try {
      this.createSandboxIfNeeded()
      const result = await this.validateInSandbox(credential)
      return result
    } catch (error) {
      this.cleanup() // Cleanup on error
      throw error
    }
  }

  private createSandboxIfNeeded() {
    if (!this.sandboxFrame) {
      this.sandboxFrame = document.createElement("iframe")
      this.sandboxFrame.sandbox.add("allow-scripts")
      this.sandboxFrame.style.display = "none"
      this.sandboxFrame.src = this.sandboxUrl
      document.body.appendChild(this.sandboxFrame)
    }
  }

  private validateInSandbox(credential: unknown): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.sandboxFrame) {
        reject(new Error("Sandbox not initialized"))
        return
      }

      // Setup timeout
      const timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error("Validation timeout"))
      }, this.validationTimeout)

      // Message handler
      const handleMessage = (event: MessageEvent<ValidationResult>) => {
        if (event.data.type === "credential-validation-result") {
          cleanup()

          if (event.data.success && event.data.credential) {
            resolve(event.data.credential)
          } else {
            reject(new Error(event.data.error || "Validation failed"))
          }
        }
      }

      // Cleanup function
      const cleanup = () => {
        clearTimeout(timeoutId)
        window.removeEventListener("message", handleMessage)
      }

      // Setup message listener
      window.addEventListener("message", handleMessage)

      // Send credential to sandbox when it's loaded
      this.sandboxFrame.onload = () => {
        this.sandboxFrame?.contentWindow?.postMessage(
          {
            type: "validate-credential",
            credential,
          },
          "*",
        )
      }
    })
  }

  cleanup() {
    if (this.sandboxFrame) {
      document.body.removeChild(this.sandboxFrame)
      this.sandboxFrame = null
    }
  }
}
