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
    } else if (util.isNullifier(payload)) {
      // TODO: This returns the entire nullifier object, but some of the fields
      // in the object deanonimize the user. We should only return what the zkApp needs
      return minaClient.createNullifier(payload.messageNullifier, privateKey)
    } else {
      throw new Error('Unsupported payload type.')
    }
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || 'Signing action failed.'
    throw new Error(errorMessage)
  }
}
