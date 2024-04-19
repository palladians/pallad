import { NodeStatus, NodeStatusProvider } from '@palladxyz/pallad-core'
import { createPublicClient, webSocket } from 'viem'

import { healthCheckOptimism } from '../utils'

export const createNodeStatusProvider = (url: string): NodeStatusProvider => {
  const getNodeStatus = async (): Promise<NodeStatus> => {
    /*if (args.chainInfo === undefined) {
      throw new Error(
        'chainInfo must be defined in `@palladxyz/pallad-core` Optimism createAccountInfoProvider'
      )
    }*/
    const client = createPublicClient({
      transport: webSocket(url)
    })

    const chainId = await client.getChainId()

    return {
      daemonStatus: {
        chainId: String(chainId)
      }
    }
  }

  return {
    healthCheck: () => healthCheckOptimism(url),
    getNodeStatus
  }
}
