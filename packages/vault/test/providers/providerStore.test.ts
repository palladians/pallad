import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { act, renderHook } from '@testing-library/react'

import { useVault } from '../../src'
import { providerFactory } from '../../src/providers'

describe('ProviderStore', () => {
  let providerConfigurations: Partial<
    Record<Multichain.MultiChainNetworks, Multichain.MultichainProviderConfig>
  >

  beforeAll(async () => {
    providerConfigurations = {
      [Mina.Networks.MAINNET]: {
        nodeUrl: 'https://proxy.mainnet.minaexplorer.com/',
        archiveUrl: 'https://mainnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.DEVNET]: {
        nodeUrl: 'https://proxy.devnet.minaexplorer.com/',
        archiveUrl: 'https://devnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.BERKELEY]: {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      }
    }
  })

  afterEach(() => {
    const {
      result: { current }
    } = renderHook(() => useVault())
    act(() => current.clear())
  })

  it('should create an providers store', async () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.providers).toEqual({})
  })

  it('should set a mainnet provider in the store', async () => {
    const { result } = renderHook(() => useVault())
    await act(async () => {
      await result.current.setProvider({
        networkName: 'Mina Mainnet',
        provider: providerFactory(
          providerConfigurations[Mina.Networks.MAINNET]!,
          Mina.Networks.MAINNET
        )
      })
      const networks = await result.current.getAvailableNetworks()
      expect(result.current.getProvider('Mina Mainnet')).toBeDefined()
      expect(networks).toContain('Mina Mainnet')
    })
  })
})
