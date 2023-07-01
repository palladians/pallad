export function getStakeTxSend(isRawSignature: boolean): string {
  if (isRawSignature) {
    return `
        mutation stakeTx($fee:UInt64!, 
        $to: PublicKey!, $from: PublicKey!, $nonce:UInt32, $memo: String,
        $validUntil: UInt32,$rawSignature: String) {
          sendDelegation(
            input: {
              fee: $fee,
              to: $to,
              from: $from,
              memo: $memo,
              nonce: $nonce,
              validUntil: $validUntil
            }, 
            signature: {rawSignature: $rawSignature}) {
            delegation {
              amount
              fee
              feeToken
              from
              hash
              id
              isDelegation
              memo
              nonce
              kind
              to
            }
          }
        }
      `
  } else {
    return `
        mutation stakeTx($fee:UInt64!,
        $to: PublicKey!, $from: PublicKey!, $nonce:UInt32, $memo: String,
        $validUntil: UInt32, $scalar: String, $field: String) {
          sendDelegation(
            input: {
              fee: $fee,
              to: $to,
              from: $from,
              memo: $memo,
              nonce: $nonce,
              validUntil: $validUntil
            }, 
            signature: {
            field: $field, scalar: $scalar
            }) {
            delegation {
              amount
              fee
              feeToken
              from
              hash
              id
              isDelegation
              memo
              nonce
              kind
              to
            }
          }
        }
      `
  }
}

export function getTxSend(isRawSignature: boolean): string {
  if (isRawSignature) {
    return `
        mutation sendTx($fee:UInt64!, $amount:UInt64!,
        $to: PublicKey!, $from: PublicKey!, $nonce:UInt32, $memo: String,
        $validUntil: UInt32,$rawSignature: String!
        ) {
          sendPayment(
            input: {
              fee: $fee,
              amount: $amount,
              to: $to,
              from: $from,
              memo: $memo,
              nonce: $nonce,
              validUntil: $validUntil
            }, 
            signature: {
              rawSignature: $rawSignature
            }) {
            payment {
              amount
              fee
              feeToken
              from
              hash
              id
              isDelegation
              memo
              nonce
              kind
              to
            }
          }
        }
      `
  } else {
    return `
        mutation sendTx($fee:UInt64!, $amount:UInt64!,
        $to: PublicKey!, $from: PublicKey!, $nonce:UInt32, $memo: String,
        $validUntil: UInt32,$scalar: String!, $field: String!
        ) {
          sendPayment(
            input: {
              fee: $fee,
              amount: $amount,
              to: $to,
              from: $from,
              memo: $memo,
              nonce: $nonce,
              validUntil: $validUntil
            }, 
            signature: {
              field: $field, scalar: $scalar
            }) {
            payment {
              amount
              fee
              feeToken
              from
              hash
              id
              isDelegation
              memo
              nonce
              kind
              to
            }
          }
        }
      `
  }
}
