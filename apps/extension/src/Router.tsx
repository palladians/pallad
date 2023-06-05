import { Box } from '@palladxyz/ui'
import { Outlet, RootRoute, Router, useNavigate } from '@tanstack/router'
import { overviewRoute } from '@/features/overview'
import { menuRoute } from '@/features/walletMenu'
import { createWalletRoute, startRoute } from '@/features/onboarding'
import { useEffect } from 'react'
import { unlockWalletRoute } from '@/features/lock'
import { useStorage } from '@plasmohq/storage/hook'
import { useVaultStore } from '@/store/vault'

const INITIALIZED = 'INITIALIZED'

const Root = () => {
  const navigate = useNavigate()
  const [wallet] = useStorage('wallet')
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  useEffect(() => {
    const initialRedirect = () => {
      if (wallet?.vaultState !== INITIALIZED) return navigate({ to: '/start' })
      if (!currentWallet) return navigate({ to: '/' })
      return navigate({ to: '/unlock' })
    }
    initialRedirect()
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

const routeTree = rootRoute.addChildren([overviewRoute, menuRoute, startRoute, createWalletRoute, unlockWalletRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
