export enum VaultState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZED = 'INITIALIZED'
}

export const TransactionFee = {
  slow: 0.001,
  default: 0.01,
  fast: 0.2
} as Record<string, number>
