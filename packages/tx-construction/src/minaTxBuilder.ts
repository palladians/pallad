import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { TransactionBody } from './types'

/**
 * Constructs a payment transaction object.
 * @param payment The payment transaction body.
 * @returns The constructed payment transaction object.
 */
export function constructPaymentTx(payment: TransactionBody): Json.Payment {
  const sendFee = BigInt(payment.fee)
  const sendAmount = payment.amount ? BigInt(payment.amount) : BigInt(0)
  const memo = payment.memo || ''
  const validUntil = payment.validUntil ? BigInt(payment.validUntil) : BigInt(0) // Mina Signer has a defaultValidUntil = '4294967295';

  return {
    to: payment.to,
    from: payment.from,
    amount: sendAmount,
    fee: sendFee,
    nonce: BigInt(payment.nonce),
    memo: memo,
    validUntil: validUntil
  }
}

/**
 * Constructs a delegation transaction object.
 * @param delegation The delegation transaction body.
 * @returns The constructed delegation transaction object.
 */
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
