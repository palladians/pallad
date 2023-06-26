export enum Network {
  Mina = 'Mina',
  Ethereum = 'Ethereum',
  BinanceSmartChain = 'BinanceSmartChain',
  Polygon = 'Polygon'
  // Add more networks here
}

export const enum KeyConst {
  PURPOSE = 44,
  // These are just examples, actual COIN_TYPEs would be different for each chain
  MINA_COIN_TYPE = 12586,
  ETHEREUM_COIN_TYPE = 60,
  BSC_COIN_TYPE = 714,
  POLYGON_COIN_TYPE = 137
  // Add more COIN_TYPEs here
}

export const enum PathLevelIndexes {
  PURPOSE = 0,
  COIN_TYPE = 1,
  ACCOUNT = 2,
  CHANGE = 3,
  INDEX = 4
}

export interface HDPath {
  accountIndex: number
  change: number
  index: number
}
