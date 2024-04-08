import { Mina } from '@palladxyz/mina-core'
import Client from 'mina-signer'

import * as errors from '../../errors'
import { ChainOperationArgs } from '../../types'
import * as util from './guards'
import {
  MinaSignablePayload,
  MinaSignatureResult,
  MinaSpecificArgs
} from './types'

export function MinaSigningOperations<T extends MinaSignablePayload>(
  payload: T,
  args: MinaSpecificArgs | ChainOperationArgs,
  privateKey: string
): MinaSignatureResult {
  if (!args.networkType) {
    throw new Error('networkType undefined in MinaSigningOperations.')
  }
  // Mina network client.
  const minaClient = new Client({ network: args.networkType })
  try {
    // Perform the specific signing action
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
          throw new Error(
            `Invalid constructed transaction, the payload is: ${payload}`
          )
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
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || 'Signing action failed.'
    throw new Error(errorMessage)
  }
}
