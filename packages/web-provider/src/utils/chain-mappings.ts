enum MinaChainId {
  MAINNET = "5f704cc0c82e0ed70e873f0893d7e06f148524e3f0bdae2afb02e7819a0c24d1",
  DEVNET = "b6ee40d336f4cc3f33c1cc04dee7618eb8e556664c2b2d82ad4676b512a82418",
}

export function chainIdToNetwork(chainId: string) {
  switch (chainId) {
    case MinaChainId.MAINNET:
      return "mainnet"
    case MinaChainId.DEVNET:
      return "devnet"
    default:
      return undefined
  }
}
