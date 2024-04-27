import type { NodeStatus, NodeStatusProvider } from "@palladxyz/pallad-core"

import { fetchGraphQL } from "../utils/fetch-utils"
import { healthCheck } from "../utils/health-check-utils"
import { getDaemonStatusQuery } from "./queries"

export const createNodeStatusProvider = (url: string): NodeStatusProvider => {
  const getNodeStatus = async (): Promise<NodeStatus> => {
    const result = await fetchGraphQL(url, getDaemonStatusQuery)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const daemonStatus = result.data

    return daemonStatus
  }

  return {
    healthCheck: () => healthCheck(url),
    getNodeStatus,
  }
}
