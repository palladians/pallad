import { Mina } from '@palladxyz/mina-core'
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

  try {
    // Perform the specific signing action
    if (args.operation) {
      switch (args.operation) {
        case 'mina_signTransaction': {
          if (util.isConstructedTransaction(payload)) {
            return minaClient.signTransaction(
              payload as Mina.ConstructedTransaction,
              privateKey
            )
          } else if (util.isZkAppTransaction(payload)) {
            return minaClient.signZkappCommand(payload.command, privateKey)
          } else {
            throw new Error('Invalid constructed transaction')
          }
        }

        case 'mina_sign': {
          if (util.isMessageBody(payload)) {
            return minaClient.signMessage(payload.message, privateKey)
          } else {
            throw new Error('Invalid message body')
          }
        }

        case 'mina_signFields': {
          if (util.isFields(payload)) {
            return minaClient.signFields(payload.fields, privateKey)
          } else {
            throw new Error('Invalid signable fields')
          }
        }

        case 'mina_createNullifier': {
          if (util.isNullifier(payload)) {
            return minaClient.createNullifier(payload.message, privateKey)
          } else {
            throw new Error('Invalid create nullifier payload')
          }
        }

        default:
          throw new Error('Unsupported private key operation')
      }
    } else {
      if (util.isConstructedTransaction(payload)) {
        return minaClient.signTransaction(payload, privateKey)
      } else if (util.isMessageBody(payload)) {
        return minaClient.signMessage(payload.message, privateKey)
      } else if (util.isFields(payload)) {
        return minaClient.signFields(payload.fields, privateKey)
      } else if (util.isZkAppTransaction(payload)) {
        return minaClient.signZkappCommand(payload.command, privateKey)
      } else if (util.isNullifier(payload)) {
        // WARNING: this payload.message is a collision with the payload.message from the signMessage type
        return minaClient.createNullifier(payload.message, privateKey)
      } else {
        throw new Error('Unsupported payload type.')
      }
    }
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || 'Signing action failed.'
    throw new Error(errorMessage)
  }
}
