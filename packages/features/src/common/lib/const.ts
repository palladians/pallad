export enum VaultState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZED = 'INITIALIZED'
}

export const TransactionFee = {
  slow: 0.001,
  default: 0.01,
  fast: 0.2
} as Record<string, number>

export const MinaChainId = {
  Mainnet: '5f704cc0c82e0ed70e873f0893d7e06f148524e3f0bdae2afb02e7819a0c24d1',
  Devnet: 'b6ee40d336f4cc3f33c1cc04dee7618eb8e556664c2b2d82ad4676b512a82418',
  Berkeley: '667b328bfc09ced12191d099f234575b006b6b193f5441a6fa744feacd9744db'
} as Record<string, string>
