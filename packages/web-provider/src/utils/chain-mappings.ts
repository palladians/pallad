import { Networks } from '@palladxyz/mina-core'

enum MinaChainId {
  MAINNET = '5f704cc0c82e0ed70e873f0893d7e06f148524e3f0bdae2afb02e7819a0c24d1',
  DEVNET = 'b6ee40d336f4cc3f33c1cc04dee7618eb8e556664c2b2d82ad4676b512a82418',
  BERKELEY = '332c8cc05ba8de9efc23a011f57015d8c9ec96fac81d5d3f7a06969faf4bce92'
  // TODO: testworld chainId
}

export function chainIdToNetwork(chainId: string) {
  switch (chainId) {
    case MinaChainId.MAINNET:
      return 'mainnet' as Networks
    case MinaChainId.DEVNET:
      return 'devnet' as Networks
    case MinaChainId.BERKELEY:
      return 'berkeley' as Networks
    default:
      return undefined
  }
}
