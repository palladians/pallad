import { Mina } from '@palladxyz/mina-core'

import { MultiChainProvider } from '../../src/Multichain/Provider'

describe('MultiChainProvider', () => {
  let provider: MultiChainProvider

  beforeAll(() => {
    provider = new MultiChainProvider(
      {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      },
      Mina.Networks.BERKELEY
    )
  })

  it('should create a mina provider and query the network', async () => {
    const accountInfo = await provider.getAccountInfo({
      publicKey: 'B62qs2mR2g7LB27P36MhxN5jnsnjS8t6azttZfCnAToVpCmTtRVT2nt'
    })

    expect(accountInfo).toBeDefined()
  })

  it('should get the chainId', async () => {
    const chainId = await provider.getChainId()

    expect(chainId).not.toBe({ daemonSatus: { chainId: 'N/A' } })
  })
})
