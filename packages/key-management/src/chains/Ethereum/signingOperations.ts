import { ethers } from "ethers"

import * as errors from "../../errors"
import type { ChainOperationArgs } from "../../types"
import * as util from "./guards"
import type {
  EthereumSignablePayload,
  EthereumSignatureResult,
  EthereumSpecificArgs,
} from "./types"

export async function EthereumSigningOperations<
  T extends EthereumSignablePayload,
>(
  payload: T,
  args: EthereumSpecificArgs | ChainOperationArgs,
  privateKey: string,
): Promise<EthereumSignatureResult> {
  // Create a wallet instance using the private key
  let wallet: ethers.Wallet | null = new ethers.Wallet(privateKey)
  let result

  try {
    // Perform the specific signing action
    if (args.operation) {
      switch (args.operation) {
        case "eth_signTransaction": {
          if (util.isTransaction(payload)) {
            result = await wallet.signTransaction(payload)
          } else {
            throw new Error("Invalid transaction payload")
          }
          break
        }

        case "eth_signMessage": {
          if (util.isMessage(payload)) {
            result = await wallet.signMessage(payload)
          } else {
            throw new Error("Invalid message payload")
          }
          break
        }

        // Add more cases as needed

        default:
          throw new Error("Unsupported private key operation")
      }
    } else {
      throw new Error("Unsupported payload type.")
    }
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || "Signing action failed."
    throw new Error(errorMessage)
  } finally {
    // Free the wallet instance
    wallet = null
  }

  return result
}
