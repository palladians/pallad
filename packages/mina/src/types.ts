export enum MinaNetwork {
  Mainnet = 'Mainnet',
  Devnet = 'Devnet',
  Berkeley = 'Berkeley'
}

export const enum MinaKeyConst {
  PURPOSE = 44,
  COIN_TYPE = 12586
}

// indexes for BIP32 path levels
export const enum MinaPathLevelIndexes {
  PURPOSE = 0,
  COIN_TYPE = 1,
  ACCOUNT = 2,
  CHANGE = 3,
  INDEX = 4
}

export interface MinaHDPath {
  accountIndex: number
  change: number
  index: number
}
