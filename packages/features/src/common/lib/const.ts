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
  Devnet: '5f704cc0c82e0ed70e873f0893d7e06f148524e3f0bdae2afb02e7819a0c24d1',
  Berkeley: '5f704cc0c82e0ed70e873f0893d7e06f148524e3f0bdae2afb02e7819a0c24d1'
} as Record<string, string>
