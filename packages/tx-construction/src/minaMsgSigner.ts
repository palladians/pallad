import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { getSignClient } from './minaClient'
import { NetworkType } from './types'

export interface MessageBody {
  message: string
}

export async function signMessage(
  privateKey: string,
  message: MessageBody,
  network: NetworkType
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

export async function verifyMessage(
  signedMessage: SignedLegacy<string>,
  network: NetworkType
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

function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}
