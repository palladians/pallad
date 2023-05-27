import { Outlet, RootRoute, Router } from '@tanstack/router'
import { overviewRoute } from './features/overview'
import { Navbar } from './components/navbar'

const Root = () => {
  return (
    <div className="flex flex-col h-screen text-base">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export const rootRoute = new RootRoute({
  component: Root
})

const routeTree = rootRoute.addChildren([overviewRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
