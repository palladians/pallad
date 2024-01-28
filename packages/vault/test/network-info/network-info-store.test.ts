import { ProviderConfig } from '@palladxyz/providers'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useVault } from '../../src'
import { DEFAULT_NETWORK_INFO } from '../../src/network-info/default'

describe('CredentialStore', () => {
  let networkNameMainnet: string
  let networkNameBerkeley: string
  let providerConfigMainnet: ProviderConfig
  let providerConfigBerkeley: ProviderConfig

  beforeEach(async () => {
    networkNameMainnet = 'Mainnet'
    // don't use the same network name
    networkNameBerkeley = 'Berkeley Other'
    providerConfigMainnet = {
      nodeEndpoint: {
        providerName: 'mina-explorer',
        url: 'https://graphql.minaexplorer.com/'
      },
      archiveNodeEndpoint: {
        providerName: 'mina-explorer',
        url: 'https://graphql.minaexplorer.com/'
      },
      networkName: networkNameMainnet,
      chainId: '...'
    }
    providerConfigBerkeley = {
      nodeEndpoint: {
        providerName: 'mina-explorer',
        url: 'https://graphql.minaexplorer.com/'
      },
      archiveNodeEndpoint: {
        providerName: 'mina-explorer',
        url: 'https://graphql.minaexplorer.com/'
      },
      networkName: networkNameBerkeley,
      chainId: '...'
    }
  })

  afterEach(() => {
    const { result } = renderHook(() => useVault())
    act(() => result.current.clear())
  })

  it('should create a network info store', async () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.networkInfo).toEqual(DEFAULT_NETWORK_INFO)
  })

  it('should add one network and remove one from store', async () => {
    let providerConfig: ProviderConfig | undefined
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setNetworkInfo(networkNameMainnet, providerConfigMainnet)
      providerConfig = result.current.getNetworkInfo(networkNameMainnet)
    })
    expect(providerConfig).toEqual(providerConfigMainnet)
    act(() => {
      result.current.removeNetworkInfo(networkNameMainnet)
      providerConfig = result.current.getNetworkInfo(networkNameMainnet)
    })
    expect(providerConfig).toBeUndefined()
  })

  it('should add two networks', async () => {
    let providerConfig: ProviderConfig | undefined
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setNetworkInfo(networkNameMainnet, providerConfigMainnet)
      result.current.setNetworkInfo(networkNameBerkeley, providerConfigBerkeley)
      providerConfig = result.current.getNetworkInfo(networkNameMainnet)
    })
    expect(providerConfig).toEqual(providerConfigMainnet)
    providerConfig = result.current.getNetworkInfo(networkNameBerkeley)
    expect(providerConfig).toEqual(providerConfigBerkeley)

    // check total number of networks
    const networks = result.current.allNetworkInfo()
    expect(networks.length).toEqual(3)
  })
  it('should add two networks and set mainnet as current network', async () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setNetworkInfo(networkNameMainnet, providerConfigMainnet)
      result.current.setNetworkInfo(networkNameBerkeley, providerConfigBerkeley)
      result.current.setCurrentNetworkName(networkNameMainnet)
    })
    const currentNetworkInfo = result.current.getCurrentNetworkInfo()
    expect(currentNetworkInfo).toEqual(currentNetworkInfo)
  })
  it('should get all chainIds', async () => {
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setNetworkInfo(networkNameMainnet, providerConfigMainnet)
      result.current.setNetworkInfo(networkNameBerkeley, providerConfigBerkeley)
    })
    const chainIds = result.current.getChainIds()
    console.log('chainIds: ', chainIds)
    expect(chainIds.length).toEqual(3)
  })
})
