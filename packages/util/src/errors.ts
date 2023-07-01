export class InvalidStringError extends Error {
  constructor(expectation: string) {
    super(`Invalid string: "${expectation}"`)
  }
}
