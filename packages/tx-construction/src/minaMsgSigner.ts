import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { getSignClient } from './minaClient'
import { Mina } from '@palladxyz/mina-core'

/**
 * Represents the body of a message.
 */
export interface MessageBody {
  message: string
}

/**
 * Signs a message using the provided private key and network.
 * @param privateKey The private key used for signing.
 * @param message The message body to sign.
 * @param network The network type.
 * @returns A Promise that resolves to the signed message.
 */
export async function signMessage(
  privateKey: string,
  message: MessageBody,
  network: Mina.NetworkType
): Promise<SignedLegacy<string>> {
  let signedMessage: SignedLegacy<string>

  try {
    const signClient = await getSignClient(network)
    signedMessage = signClient.signMessage(message.message, privateKey)
  } catch (err) {
    const errorMessage = getRealErrorMsg(err) || 'Message signing failed.'
    throw new Error(errorMessage)
  }

  return signedMessage
}

/**
 * Verifies the authenticity of a signed message using the provided network.
 * @param signedMessage The signed message to verify.
 * @param network The network type.
 * @returns A Promise that resolves to a boolean indicating the verification result.
 */
export async function verifyMessage(
  signedMessage: SignedLegacy<string>,
  network: Mina.NetworkType
): Promise<boolean> {
  let isMessageValid: boolean

  try {
    const signClient = await getSignClient(network)
    isMessageValid = signClient.verifyMessage(signedMessage)
  } catch (err) {
    const errorMessage = getRealErrorMsg(err) || 'Message verification failed.'
    throw new Error(errorMessage)
  }

  return isMessageValid
}

/**
 * Retrieves the actual error message from an unknown error object.
 * @param err The unknown error object.
 * @returns The actual error message if available, or undefined otherwise.
 */
function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}
