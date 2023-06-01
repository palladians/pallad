import { Box } from '@palladxyz/ui'
import { Outlet, RootRoute, Router, useNavigate } from '@tanstack/router'
import { overviewRoute } from '@/features/overview'
import { menuRoute } from '@/features/walletMenu'
import { startRoute } from '@/features/onboarding'
import { useEffect } from 'react'

const Root = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate({ to: '/start' })
  }, [])
  return (
    <Box css={{ flex: 1, height: '100vh' }}>
      <Outlet />
    </Box>
  )
}

export const rootRoute = new RootRoute({
  component: Root
})

const routeTree = rootRoute.addChildren([overviewRoute, menuRoute, startRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
