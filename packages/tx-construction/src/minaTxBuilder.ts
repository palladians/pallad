import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { getSignClient } from './minaClient'
import { NetworkType } from './types'
import { TransactionBody } from './types'

export function constructPaymentTx(payment: TransactionBody): Json.Payment {
  const sendFee = BigInt(payment.fee)
  const sendAmount = payment.amount ? BigInt(payment.amount) : BigInt(0)
  const memo = payment.memo || ''
  const validUntil = payment.validUntil ? BigInt(payment.validUntil) : BigInt(0)

  return {
    to: payment.to,
    from: payment.from,
    amount: sendAmount,
    fee: sendFee,
    nonce: BigInt(payment.nonce),
    memo: memo,
    validUntil: validUntil // Mina Signer has a defaultValidUntil = '4294967295';
  }
}

export function constructDelegationTx(
  delegation: TransactionBody
): Json.StakeDelegation {
  const sendFee = BigInt(delegation.fee)
  const memo = delegation.memo || ''
  const validUntil = delegation.validUntil
    ? BigInt(delegation.validUntil)
    : BigInt(0) // Mina Signer has a defaultValidUntil = '4294967295';

  return {
    to: delegation.to,
    from: delegation.from,
    fee: sendFee,
    nonce: BigInt(delegation.nonce),
    memo: memo,
    validUntil: validUntil
  }
}

export async function signPayment(
  privateKey: string,
  payment: TransactionBody,
  network: NetworkType
): Promise<SignedLegacy<Json.Payment>> {
  let signedPayment: SignedLegacy<Json.Payment>

  try {
    const signClient = await getSignClient(network)
    const paymentTx = constructPaymentTx(payment)

    signedPayment = signClient.signPayment(paymentTx, privateKey)
  } catch (err) {
    const errorMessage = getRealErrorMsg(err) || 'Building transaction failed.'
    throw new Error(errorMessage)
  }

  return signedPayment
}

export async function signDelegation(
  privateKey: string,
  delegation: TransactionBody,
  network: NetworkType
): Promise<SignedLegacy<Json.StakeDelegation>> {
  let signedStakingPayment: SignedLegacy<Json.StakeDelegation>

  try {
    const signClient = await getSignClient(network)
    const delegationTx = constructDelegationTx(delegation)

    signedStakingPayment = signClient.signStakeDelegation(
      delegationTx,
      privateKey
    )
  } catch (error) {
    throw new Error('Building transaction failed.')
  }

  return signedStakingPayment
}

function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}
