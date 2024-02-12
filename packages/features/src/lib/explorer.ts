const MINAVERSE_URL = 'https://minaverse.xyz/'

export const getAccountUrl = ({
  network,
  publicKey
}: {
  network: string
  publicKey: string
}) => `${MINAVERSE_URL}/${network.toLowerCase()}/accounts/${publicKey}`

export const getTransactionUrl = ({
  network,
  hash
}: {
  network: string
  hash: string
}) => `${MINAVERSE_URL}/${network.toLowerCase()}/transactions/${hash}`
