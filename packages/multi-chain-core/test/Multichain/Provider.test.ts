import { Mina } from '@palladxyz/mina-core'

import { MultiChainProvider } from '../../src/Multichain/Provider'

describe.skip('MultiChainProvider', () => {
  it('should create a mina provider and query the network', async () => {
    const provider = new MultiChainProvider(
      {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      },
      Mina.Networks.BERKELEY
    )

    const accountInfo = await provider.getAccountInfo({
      publicKey: 'B62qs2mR2g7LB27P36MhxN5jnsnjS8t6azttZfCnAToVpCmTtRVT2nt'
    })

    expect(accountInfo).toBeDefined()
  })
})
