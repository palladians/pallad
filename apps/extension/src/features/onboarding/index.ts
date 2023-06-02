import { rootRoute } from '@/Router'
import { Route } from '@tanstack/router'
import { StartView } from './views/Start'
import { CreateWalletView } from '@/features/onboarding/views/CreateWallet'

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
