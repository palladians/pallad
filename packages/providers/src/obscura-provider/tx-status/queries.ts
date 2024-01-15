export const transactionStatus = `
    query TransactionStatus($id: ID!) {
      transactionStatus(payment: $id) 
    }
`
