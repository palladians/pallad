import { Chain, createPublicClient, webSocket } from 'viem'
import { optimismSepolia } from 'viem/chains'

export const healthCheckOptimism = async (
  url: string
): Promise<{ ok: boolean; message: string }> => {
  const client = createPublicClient({
    chain: optimismSepolia as Chain,
    transport: webSocket(url)
  })

  const result = await client.getChainId()

  if (!result) {
    return {
      ok: false,
      message: 'Health check failed'
    }
  }

  if (result) {
    return {
      ok: true,
      message: 'RPC is happy!'
    }
  }

  return {
    ok: false,
    message: 'Unexpected response format'
  }
}
