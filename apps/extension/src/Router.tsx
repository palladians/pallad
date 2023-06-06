import { Box } from '@palladxyz/ui'
import { Outlet, RootRoute, Router, useNavigate } from '@tanstack/router'
import { overviewRoute } from '@/features/overview'
import { menuRoute } from '@/features/walletMenu'
import {
  createWalletRoute,
  mnemonicConfirmationRoute,
  mnemonicInputRoute,
  mnemonicWritedownRoute,
  restoreWalletRoute,
  startRoute
} from '@/features/onboarding'
import { useEffect } from 'react'
import { unlockWalletRoute } from '@/features/lock'
import { VaultState } from '@/lib/const'
import { useLocalWallet } from '@/lib/hooks.ts'
import { sessionData } from '@/lib/storage.ts'

const Root = () => {
  const navigate = useNavigate()
  const [wallet] = useLocalWallet()
  useEffect(() => {
    const initialRedirect = async () => {
      const spendingPassword = await sessionData.get('spendingPassword')
      const initializedVault = wallet?.vaultState === VaultState[VaultState.INITIALIZED]
      if (!initializedVault) return navigate({ to: '/start' })
      if (initializedVault && !spendingPassword) return navigate({ to: '/unlock' })
      return navigate({ to: '/' })
    }
    initialRedirect()
  }, [wallet])
  return (
    <Box css={{ flex: 1, height: '100vh' }}>
      <Outlet />
    </Box>
  )
}

export const rootRoute = new RootRoute({
  component: Root
})

const routeTree = rootRoute.addChildren([
  overviewRoute,
  menuRoute,
  startRoute,
  createWalletRoute,
  unlockWalletRoute,
  mnemonicWritedownRoute,
  mnemonicConfirmationRoute,
  restoreWalletRoute,
  mnemonicInputRoute
])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
