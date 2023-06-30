import Client from 'mina-signer'

import { NetworkType } from './types'

interface NetConfig {
  netType: NetworkType
}

async function getCurrentNetConfig(network: NetworkType): Promise<NetConfig> {
  const netConfig: NetConfig = { netType: network }
  return netConfig
}

export async function getSignClient(network: NetworkType): Promise<Client> {
  const netConfig: NetConfig = await getCurrentNetConfig(network)
  const netType: NetworkType = netConfig.netType || 'mainnet'

  const client = new Client({ network: netType })
  return client
}
