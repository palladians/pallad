import { rootRoute } from '@/Router'
import { Route } from '@tanstack/router'
import { MenuView } from './views/Menu'

export const menuRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuView
})
