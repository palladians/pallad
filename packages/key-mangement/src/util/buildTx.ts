import { Mina } from '@palladxyz/mina-core'
import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

/**
 * Constructs a payment transaction object.
 * @param payment The payment transaction body.
 * @returns The constructed payment transaction object.
 */
export function constructPaymentTx(
  payment: Mina.TransactionBody
): Json.Payment {
  const sendFee = BigInt(payment.fee)
  const sendAmount = payment.amount ? BigInt(payment.amount) : BigInt(0)
  const memo = payment.memo || ''
  const validUntil = payment.validUntil
    ? BigInt(payment.validUntil)
    : BigInt(4294967295) // Mina Signer has a defaultValidUntil = '4294967295';

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
  delegation: Mina.TransactionBody
): Json.StakeDelegation {
  const sendFee = BigInt(delegation.fee)
  const memo = delegation.memo || ''
  const validUntil = delegation.validUntil
    ? BigInt(delegation.validUntil)
    : BigInt(4294967295) // Mina Signer has a defaultValidUntil = '4294967295';

  return {
    to: delegation.to,
    from: delegation.from,
    fee: sendFee,
    nonce: BigInt(delegation.nonce),
    memo: memo,
    validUntil: validUntil
  }
}

/**
 * Constructs a transaction object based on the kind of transaction.
 * @param transaction The transaction body.
 * @param transactionKind The kind of transaction.
 * @returns The constructed transaction object.
 */
export function constructTransaction(
  transaction: Mina.TransactionBody,
  transactionKind: Mina.TransactionKind
): Mina.ConstructedTransaction {
  switch (transactionKind) {
    case Mina.TransactionKind.PAYMENT:
      return {
        ...constructPaymentTx(transaction),
        type: Mina.TransactionKind.PAYMENT
      }
    case Mina.TransactionKind.STAKE_DELEGATION:
      return {
        ...constructDelegationTx(transaction),
        type: Mina.TransactionKind.STAKE_DELEGATION
      }
    default:
      throw new Error('Unsupported transaction kind')
  }
}
