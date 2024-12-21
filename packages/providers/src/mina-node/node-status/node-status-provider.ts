import type { NodeStatus, NodeStatusProvider } from "@palladco/pallad-core"

import { createGraphQLRequest } from "../utils/fetch-utils"
import { healthCheck } from "../utils/health-check-utils"
import { getDaemonStatusQuery } from "./queries"

export const createNodeStatusProvider = (url: string): NodeStatusProvider => {
  const getNodeStatus = async (): Promise<NodeStatus> => {
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
    getNodeStatus,
  }
}
