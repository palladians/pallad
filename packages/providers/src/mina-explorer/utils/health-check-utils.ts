import { createGraphQLRequest } from './fetch-utils'

export const healthCheckQuery = `{ syncStatus }`
export const healthCheckQueryArchive = `
  {
    __schema {
      types {
        name
      }
    }
  }
`

export const healthCheck = async (
  url: string,
  query: string = healthCheckQuery
): Promise<{ ok: boolean; message: string }> => {
  const request = createGraphQLRequest(url)

  const result = await request(query)

  if (!result.ok) {
    return {
      ok: false,
      message: result.message || 'Health check failed'
    }
  }

  // Check for syncStatus response
  const syncStatus = result.data?.syncStatus
  if (syncStatus !== undefined) {
    return {
      ok: syncStatus === 'SYNCED',
      message: syncStatus
        ? `Sync status: ${syncStatus}`
        : 'No sync status data available'
    }
  }

  // Check for __schema response
  const schemaTypes = result.data?.__schema?.types
  if (schemaTypes) {
    return {
      ok: true,
      message: 'Schema types available'
    }
  }

  // If neither response is found
  return {
    ok: false,
    message: 'Unexpected response format'
  }
}
