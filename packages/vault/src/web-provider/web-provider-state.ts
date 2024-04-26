export enum AuthorizationState {
  ALLOWED = "ALLOWED",
  BLOCKED = "BLOCKED",
}

export type ZkAppUrl = string

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} WebProviderStore
 */

export type WebProviderState = {
  authorized: Record<ZkAppUrl, AuthorizationState>
}

export type WebProviderActions = {
  mutateZkAppPermission: ({
    origin,
    authorizationState,
  }: {
    origin: ZkAppUrl
    authorizationState: AuthorizationState
  }) => void
  removeZkAppPermission: ({ origin }: { origin: ZkAppUrl }) => void
  reset: () => void
}

export type WebProviderStore = WebProviderState & WebProviderActions
