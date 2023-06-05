import { Route } from '@tanstack/router'
import { rootRoute } from '@/Router'
import { UnlockWalletView } from './views/UnlockWallet'

export const unlockWalletRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/unlock',
  component: UnlockWalletView
})
