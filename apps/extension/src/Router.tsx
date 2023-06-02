import { Box } from '@palladxyz/ui'
import { Outlet, RootRoute, Router } from '@tanstack/router'
import { overviewRoute } from '@/features/overview'
import { menuRoute } from '@/features/walletMenu'
import { createWalletRoute, startRoute } from '@/features/onboarding'

const Root = () => {
  return (
    <Box css={{ flex: 1, height: '100vh' }}>
      <Outlet />
    </Box>
  )
}

export const rootRoute = new RootRoute({
  component: Root
})

const routeTree = rootRoute.addChildren([overviewRoute, menuRoute, startRoute, createWalletRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
