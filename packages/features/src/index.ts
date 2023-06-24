import '@total-typescript/ts-reset'

import type {} from '@trpc/server'
import type {} from 'graphql-request'
import type {} from 'swr'
export {
  localPersistence,
  securePersistence,
  sessionPersistence
} from './common/lib/storage'
export { trpc } from './common/lib/trpc'
export { appStore } from './common/store/app'
export { vaultStore } from './common/store/vault'
export { Router } from './Router'
export { theme, ThemeProvider } from '@palladxyz/ui'
