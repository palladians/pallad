/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} WebProviderStore
 */

export type WebProviderState = {
  enabled: boolean
}

export type WebProviderActions = {
  setEnabled: (enabled: boolean) => void
  getEnabled: () => boolean
  clear: () => void
}

export type WebProviderStore = WebProviderState & WebProviderActions
