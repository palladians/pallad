import { Mina } from '@palladxyz/mina-core'

export enum DarkMatterNetworks {
  DARKMATTERMAINNET = 'darkmattermainnet',
  DARKMATTERTESTNET = 'darkmattertestnet'
}

export type MultiChainNetworks = Mina.Networks | DarkMatterNetworks
