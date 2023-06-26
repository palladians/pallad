export enum Network {
  Mina = 'Mina',
  Ethereum = 'Ethereum',
  Polygon = 'Polygon'
  // Add more networks here
}

export const enum KeyConst {
  PURPOSE = 44,
  // These are just examples, actual COIN_TYPEs would be different for each chain
  MINA_COIN_TYPE = 12586,
  ETHEREUM_COIN_TYPE = 60,
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
