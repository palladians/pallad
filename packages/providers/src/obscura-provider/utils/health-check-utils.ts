import type { HealthCheckResponse } from "@palladxyz/mina-core"

import { fetchGraphQL } from "./fetch-utils"

export const healthCheckQuery = "{ syncStatus }"

export const healthCheck = async (
  url: string,
): Promise<HealthCheckResponse> => {
  const result = await fetchGraphQL(url, healthCheckQuery)
  if (!result.ok) {
    return result
  }
  return {
    ok: result.data && result.data.syncStatus === "SYNCED",
    message: result.data
      ? `Sync status: ${result.data.syncStatus}`
      : "No sync status data available",
  }
}
