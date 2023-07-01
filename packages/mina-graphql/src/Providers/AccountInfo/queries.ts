export const healthCheckQuery = `
  {
    __schema {
      types {
        name
      }
    }
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
