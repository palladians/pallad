export const healthCheckQuery = `
  {
    __schema {
      types {
        name
      }
    }
  }
`
export const transactionStatus = `
    query TransactionStatus($id: ID!) {
      transactionStatus(payment: $id) 
    }
`
