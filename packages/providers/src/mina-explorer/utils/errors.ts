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

    // Manually adjust the stack trace to omit the constructor call
    if (this.stack) {
      const newStack = this.stack.split('\n')
      newStack.splice(1, 1) // Remove the constructor call from the stack trace
      this.stack = newStack.join('\n')
    }
  }
}
