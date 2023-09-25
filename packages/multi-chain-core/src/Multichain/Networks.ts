import { Mina } from '@palladxyz/mina-core'

enum DarkMatterNetworks {
  DARKMATTERMAINNET = 'darkmattermainnet',
  DARKMATTERTESTNET = 'darkmattertestnet'
}

export type MultiChainNetworks = Mina.Networks | DarkMatterNetworks
