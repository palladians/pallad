export interface ExtendedError extends Error {
  text?: string
}

export class ServerError extends Error {
  originalError: Error
  statusCode: number
  responseBody?: string | undefined

  constructor(
    originalError: ExtendedError,
    statusCode: number,
    responseBody?: string
  ) {
    super(`Server Error: ${statusCode} - ${originalError.message}`)
    this.name = 'ServerError'
    this.originalError = originalError
    this.statusCode = statusCode
    this.responseBody = responseBody

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError)
    } else {
      this.stack = originalError.stack || '' // Handling potential undefined
    }
  }
}
