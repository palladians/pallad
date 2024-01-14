export const healthCheckQuery = `{ syncStatus }`

export const getAccountInfoQuery = `
query accountBalance($publicKey: PublicKey!) {
    account(publicKey: $publicKey) {
        balance {
            total
        },
        nonce,
        inferredNonce,
        delegate,
        publicKey
    }
}
`
