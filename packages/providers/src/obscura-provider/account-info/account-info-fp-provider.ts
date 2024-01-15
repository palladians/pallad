import { AccountInfoArgs, AccountInfoProvider } from '@palladxyz/mina-core'

import { fetchGraphQL } from '../utils/fetch-utils'
import { healthCheck, healthCheckQuery } from '../utils/health-check-utils'
import { getAccountInfoQuery } from './queries'

export const createAccountInfoProvider = (url: string): AccountInfoProvider => {
  const getAccountInfo = async (args: AccountInfoArgs) => {
    const variables = { publicKey: args.publicKey }
    const result = await fetchGraphQL(url, getAccountInfoQuery, variables)
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

  return {
    healthCheck: () => healthCheck(url, healthCheckQuery),
    getAccountInfo
  }
}
