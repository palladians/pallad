import { CustomError } from "ts-custom-error"

export class InvalidMnemonicError extends CustomError {
  public constructor() {
    super("Invalid Mnemonic")
  }
}
