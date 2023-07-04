import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import {
  PrivateKey,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { getSignClient } from './minaClient'
import { ConstructedTransaction, NetworkType, SignedTransaction } from './types'

/**
 * Verifies the authenticity of a signed transaction using the provided network.
 * @param signedTransaction The signed transaction to verify.
 * @param network The network type.
 * @returns A Promise that resolves to a boolean indicating the verification result.
 */
export async function verifyTransaction(
  signedTransaction:
    | SignedLegacy<Json.Payment>
    | SignedLegacy<Json.StakeDelegation>,
  network: NetworkType
): Promise<boolean> {
  try {
    const signClient = await getSignClient(network)
    return signClient.verifyTransaction(signedTransaction)
  } catch (err) {
    throw new Error('Transaction verification failed.')
  }
}

/**
 * Retrieves the actual error message from an unknown error object.
 * @param err The unknown error object.
 * @returns The actual error message if available, or undefined otherwise.
 */
function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}

/**
 * Signs a transaction using the provided private key and network.
 * @param privateKey The private key used for signing.
 * @param transactionTx The constructed transaction.
 * @param network The network type.
 * @returns A Promise that resolves to the signed transaction.
 */
export async function signTransaction(
  privateKey: PrivateKey,
  transactionTx: ConstructedTransaction,
  network: NetworkType
): Promise<SignedTransaction> {
  let signedTransaction: SignedLegacy<ConstructedTransaction>

  try {
    const signClient = await getSignClient(network)

    signedTransaction = signClient.signTransaction(transactionTx, privateKey)
  } catch (err) {
    const errorMessage = getRealErrorMsg(err) || 'Building transaction failed.'
    throw new Error(errorMessage)
  }

  return signedTransaction
}
