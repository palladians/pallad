import { ethers } from 'ethers'

import * as errors from '../../errors'
import * as util from './guards'
import { EthereumSignablePayload, EthereumSignatureResult } from './types'

export async function EthereumSigningOperations<
  T extends EthereumSignablePayload
>(
  payload: T,
  //args: EthereumSpecificArgs, // this is not used in the function
  privateKey: string
): Promise<EthereumSignatureResult> {
  // Create a wallet instance using the private key
  const wallet = new ethers.Wallet(privateKey)

  // Perform the specific signing action
  try {
    if (util.isTransaction(payload)) {
      // Sign a transaction
      const transaction = await wallet.signTransaction(payload)
      // remove wallet from memory
      // wallet.free();
      return transaction
    } else if (util.isMessage(payload)) {
      // Sign a message
      const signature = await wallet.signMessage(payload)
      // remove wallet from memory
      // wallet.free();
      return signature
    } else {
      throw new Error('Unsupported payload type.')
    }
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || 'Signing action failed.'
    throw new Error(errorMessage)
  }
}
