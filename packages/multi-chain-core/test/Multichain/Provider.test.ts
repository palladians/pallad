import { Mina } from '@palladxyz/mina-core'

import { MultiChainProvider } from '../../src/Multichain/Provider'

describe('MultiChainProvider', () => {
  it('should create a mina provider and query the network', async () => {
    const provider = new MultiChainProvider(
      {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      },
      Mina.Networks.BERKELEY
    )

    const accountInfo = await provider.getAccountInfo({
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    })

    expect(accountInfo).toBeDefined()
  })
})
