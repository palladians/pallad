export class WalletError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WalletError'

    Object.setPrototypeOf(this, WalletError.prototype)
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'

    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class AddressError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AddressError'

    Object.setPrototypeOf(this, AddressError.prototype)
  }
}
