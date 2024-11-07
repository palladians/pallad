export interface ValidationResult {
  type: "credential-validation-result"
  success: boolean
  credential?: string
  error?: string
}

export interface ValidationRequest {
  type: "validate-credential"
  credential: unknown
}
