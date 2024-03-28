import { DaemonStatus, DaemonStatusProvider } from '@palladxyz/mina-core'

import { createGraphQLRequest } from '../utils/fetch-utils'
import { healthCheck } from '../utils/health-check-utils'
import { getDaemonStatusQuery } from './queries'

export const createDaemonStatusProvider = (
  url: string
): DaemonStatusProvider => {
  const getDaemonStatus = async (): Promise<DaemonStatus> => {
    const fetchGraphQL = createGraphQLRequest(url)
    const result = await fetchGraphQL(getDaemonStatusQuery)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const daemonStatus = result.data

    return daemonStatus
  }

  return {
    healthCheck: () => healthCheck(url),
    getDaemonStatus
  }
}
