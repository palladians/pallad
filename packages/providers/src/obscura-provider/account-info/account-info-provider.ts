import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider
} from '@palladxyz/pallad-core'

import { fetchGraphQL } from '../utils/fetch-utils'
import { healthCheck } from '../utils/health-check-utils'
import { getTokenAccountInfoQuery } from './queries'

export const createAccountInfoProvider = (url: string): AccountInfoProvider => {
  const getAccountInfo = async (
    args: AccountInfoArgs
  ): Promise<Record<string, AccountInfo>> => {
    const variables = { publicKey: args.publicKey }
    const query = getTokenAccountInfoQuery(args.tokenMap || { MINA: '1' })
    const result = await fetchGraphQL(url, query, variables)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const accountsData = result.data
    console.log('accountsData', accountsData)
    const accountsInfo: Record<string, AccountInfo> = {}

    for (const [key, account] of Object.entries(accountsData)) {
      if (account === null) {
        accountsInfo[key] = {
          balance: { total: 0 },
          nonce: 0,
          inferredNonce: 0,
          delegate: '',
          publicKey: args.publicKey
        }
      } else {
        accountsInfo[key] = account as AccountInfo
      }
    }

    return accountsInfo
  }

  return {
    healthCheck: () => healthCheck(url),
    getAccountInfo
  }
}
