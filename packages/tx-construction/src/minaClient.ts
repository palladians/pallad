import Client from 'mina-signer'

import { Mina } from '@palladxyz/mina-core'
/**
 * Represents the network configuration.
 */
interface NetConfig {
  netType: Mina.NetworkType
}

/**
 * Retrieves the current network configuration.
 * @param network The network type.
 * @returns A Promise that resolves to the current network configuration.
 */
async function getCurrentNetConfig(network: Mina.NetworkType): Promise<NetConfig> {
  const netConfig: NetConfig = { netType: network }
  return netConfig
}

/**
 * Retrieves the signing client for the specified network.
 * @param network The network type.
 * @returns A Promise that resolves to the signing client for the specified network.
 */
export async function getSignClient(network: Mina.NetworkType): Promise<Client> {
  const netConfig: NetConfig = await getCurrentNetConfig(network)
  const netType: Mina.NetworkType = netConfig.netType || 'mainnet'

  const client = new Client({ network: netType })
  return client
}
