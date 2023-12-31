import Client from 'mina-signer'

import * as errors from '../../errors'
import * as util from './guards'
import {
  MinaSignablePayload,
  MinaSignatureResult,
  MinaSpecificArgs
} from './types'

export async function MinaSigningOperations<T extends MinaSignablePayload>(
  payload: T,
  args: MinaSpecificArgs,
  privateKey: string
): Promise<MinaSignatureResult> {
  // Mina network client.
  const minaClient = new Client({ network: args.networkType })
  // Perform the specific signing action
  try {
    if (util.isConstructedTransaction(payload)) {
      return minaClient.signTransaction(payload, privateKey)
    } else if (util.isMessageBody(payload)) {
      return minaClient.signMessage(payload.message, privateKey)
    } else if (util.isFields(payload)) {
      return minaClient.signFields(payload.fields, privateKey)
    } else if (util.isZkAppTransaction(payload)) {
      return minaClient.signZkappCommand(payload.command, privateKey)
    } else {
      throw new Error(`Unsupported payload type of ${payload}.`)
    }
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || 'Signing action failed.'
    throw new Error(`Error during Mina signing operations: ${errorMessage}`)
  }
}
