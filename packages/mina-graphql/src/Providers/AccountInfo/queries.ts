export const healthCheckQuery = `
query {
  syncStatus
}
`

export const getAccountBalance = `
  query accountBalance($publicKey: PublicKey!) {
    account(publicKey: $publicKey) {
      balance {
        total
      },
      nonce
      inferredNonce
      delegate
      publicKey
    }
  }
`
