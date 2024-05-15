import { type BorrowedTypes, Mina } from "@palladxyz/mina-core"

// Low-level Mina constructTx API for spending Mina only.

/**
 * Constructs a payment transaction object.
 * @param payment The payment transaction body.
 * @returns The constructed payment transaction object.
 */
export function constructPaymentTx(
  payment: Mina.TransactionBody,
): BorrowedTypes.Payment {
  const sendFee = BigInt(payment.fee)
  const sendAmount = payment.amount ? BigInt(payment.amount) : BigInt(0)
  const memo = payment.memo || ""
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
    validUntil: validUntil,
  }
}

/**
 * Constructs a delegation transaction object.
 * @param delegation The delegation transaction body.
 * @returns The constructed delegation transaction object.
 */
export function constructDelegationTx(
  delegation: Mina.TransactionBody,
): BorrowedTypes.StakeDelegation {
  const sendFee = BigInt(delegation.fee)
  const memo = delegation.memo || ""
  const validUntil = delegation.validUntil
    ? BigInt(delegation.validUntil)
    : BigInt(4294967295) // Mina Signer has a defaultValidUntil = '4294967295';

  return {
    to: delegation.to,
    from: delegation.from,
    fee: sendFee,
    nonce: BigInt(delegation.nonce),
    memo: memo,
    validUntil: validUntil,
  }
}

/**
 * Constructs a transaction object based on the kind of transaction.
 * @param transaction The transaction body.
 * @param transactionType The kind of transaction.
 * @returns The constructed transaction object.
 */
export function constructTransaction(
  transaction: Mina.TransactionBody,
  transactionType: Mina.TransactionType,
): Mina.ConstructedTransaction {
  switch (transactionType) {
    case Mina.TransactionType.PAYMENT:
      return {
        ...constructPaymentTx(transaction),
        type: Mina.TransactionType.PAYMENT,
      }
    case Mina.TransactionType.STAKE_DELEGATION:
      return {
        ...constructDelegationTx(transaction),
        type: Mina.TransactionType.STAKE_DELEGATION,
      }
    default:
      throw new Error("Unsupported transaction kind")
  }
}
