import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { getSignClient } from './minaClient'
import { constructDelegationTx, constructPaymentTx } from './minaTxBuilder'
import { NetworkType } from './types'
import { TransactionBody } from './types'

export async function signTransaction(
  privateKey: string,
  transaction: TransactionBody,
  network: NetworkType
): Promise<SignedLegacy<Json.Payment> | SignedLegacy<Json.StakeDelegation>> {
  let signedTransaction:
    | SignedLegacy<Json.Payment>
    | SignedLegacy<Json.StakeDelegation>

  try {
    const signClient = await getSignClient(network)
    const transactionTx =
      transaction.type === 'payment'
        ? constructPaymentTx(transaction)
        : constructDelegationTx(transaction)

    signedTransaction = signClient.signTransaction(transactionTx, privateKey)
  } catch (err) {
    const errorMessage = getRealErrorMsg(err) || 'Building transaction failed.'
    throw new Error(errorMessage)
  }

  return signedTransaction
}

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

function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}
