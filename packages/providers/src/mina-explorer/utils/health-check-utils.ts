import { createGraphQLRequest } from './fetch-utils'

export const healthCheckQuery = `{ syncStatus }`

export const healthCheck = async (
  url: string
): Promise<{ ok: boolean; message: string }> => {
  const request = createGraphQLRequest(url)

  const result = await request<{ syncStatus?: string }>(healthCheckQuery)

  if (!result.ok) {
    return {
      ok: false,
      message: result.message || 'Health check failed'
    }
  }

  const syncStatus = result.data?.syncStatus

  return {
    ok: syncStatus === 'SYNCED',
    message: syncStatus
      ? `Sync status: ${syncStatus}`
      : 'No sync status data available'
  }
}
