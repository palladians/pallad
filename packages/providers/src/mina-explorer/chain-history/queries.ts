export const healthCheckQuery = `
  {
    __schema {
      types {
        name
      }
    }
  }
`

export const transactionsByAddressesQuery = `
  query Transactions($address: String!, $limit: Int) {
    transactions(
      query: { canonical: true, OR: [{ to: $address }, { from: $address }] }
      limit: $limit
      sortBy: DATETIME_DESC
    ) {
      amount
      to
      token
      kind
      isDelegation
      hash
      from
      fee
      failureReason
      dateTime
      blockHeight
    }
  }
`

export const transactionsByHashesQuery = `
  query Transaction($hash: String!) {
    transaction(query: { hash: $hash }) {
      amount
      blockHeight
      dateTime
      failureReason
      fee
      from
      hash
      id
      isDelegation
      kind
      memo
      nonce
      to
      token
    }
  }
`
