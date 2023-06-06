import { rootRoute } from '@/Router'
import { Route } from '@tanstack/router'
import { StartView } from './views/Start'
import { CreateWalletView } from './views/CreateWallet'
import { MnemonicWritedownView } from './views/MnemonicWritedown'
import { MnemonicConfirmationView } from './views/MnemonicConfirmation'
import { RestoreWalletView } from './views/RestoreWallet'
import { MnemonicInputView } from './views/MnemonicInput'

export const startRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/start',
  component: StartView
})

export const createWalletRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateWalletView
})

export const mnemonicWritedownRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/writedown',
  component: MnemonicWritedownView
})

export const mnemonicConfirmationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/confirmation',
  component: MnemonicConfirmationView
})

export const restoreWalletRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/restore',
  component: RestoreWalletView
})

export const mnemonicInputRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/mnemonic',
  component: MnemonicInputView
})
