import { AccountInfoArgs, AccountInfoProvider } from '@palladxyz/mina-core'

import { getAccountInfoQuery, healthCheckQuery } from './queries'

export const createAccountInfoProvider = (url: string): AccountInfoProvider => {
  const fetchGraphQL = async (
    query: string,
    variables?: Record<string, any>
  ) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      })

      if (!response.ok) {
        return { ok: false, message: `HTTP error! status: ${response.status}` }
      }

      const data = await response.json()

      if (data.errors) {
        return {
          ok: false,
          message: `GraphQL error: ${data.errors
            .map((e: any) => e.message)
            .join(', ')}`
        }
      }

      return { ok: true, data: data.data }
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, message: `Error: ${error.message}` }
      }
      return { ok: false, message: 'An unknown error occurred' }
    }
  }

  const healthCheck = async () => {
    const result = await fetchGraphQL(healthCheckQuery)
    if (!result.ok) {
      return result
    }
    return {
      ok: result.data && result.data.syncStatus === 'SYNCED',
      message: result.data
        ? `Sync status: ${result.data.syncStatus}`
        : 'No sync status data available'
    }
  }

  const getAccountInfo = async (args: AccountInfoArgs) => {
    const variables = { publicKey: args.publicKey }
    const result = await fetchGraphQL(getAccountInfoQuery, variables)
    if (!result.ok) {
      throw new Error(result.message)
    }

    const account = result.data.account
    if (account === null) {
      return {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: '',
        publicKey: args.publicKey
      }
    }

    return account
  }

  return { healthCheck, getAccountInfo }
}
