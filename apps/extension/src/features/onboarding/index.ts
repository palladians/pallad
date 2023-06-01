import { rootRoute } from '@/Router'
import { Route } from '@tanstack/router'
import { StartView } from './views/Start'

export const startRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/start',
  component: StartView
})
