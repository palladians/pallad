export const healthCheckQuery = `
{
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
      delegateAccount {
        publicKey
      }
      publicKey
    }
  }
`
