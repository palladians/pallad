import { getSecurePersistence } from '@palladxyz/persistence'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { keyAgentName } from '../keyAgent/keyAgentState'
import {
  credentialName,
  CredentialState,
  initialCredentialState,
  SearchQuery,
  SingleCredentialState,
  storedCredential
} from './credentialsState'
import { matchesQuery } from './utils'

export class CredentialStore {
  private store: any //StoreApi<CredentialState>

  constructor() {
    const persistedStore = createStore<CredentialState>()(
      persist(
        (set, get) => ({
          state: {
            credentials: {}
          },
          getState: get as () => CredentialState,

          ensureCredential: (
            credentialName: credentialName,
            keyAgentName: keyAgentName
          ): void => {
            set((current: CredentialState) => {
              if (!current.state.credentials[credentialName]) {
                return {
                  ...current,
                  state: {
                    ...current.state,
                    credentials: {
                      ...current.state.credentials,
                      [credentialName]: {
                        ...initialCredentialState,
                        credentialName: credentialName,
                        keyAgentName: keyAgentName
                      }
                    }
                  }
                }
              }
              return current
            })
          },

          setCredential: (credentialState: SingleCredentialState): void => {
            const { credentialName } = credentialState
            set((current: CredentialState) => ({
              ...current,
              state: {
                ...current.state,
                credentials: {
                  ...current.state.credentials,
                  [credentialName]: credentialState
                }
              }
            }))
          },

          getCredential: (
            credentialName: credentialName
          ): SingleCredentialState | typeof initialCredentialState => {
            const current = get()
            return (
              current.state.credentials[credentialName] ||
              initialCredentialState
            )
          },

          removeCredential: (credentialName: credentialName): void => {
            set((current: CredentialState) => {
              const newCredentials = { ...current.state.credentials }
              delete newCredentials[credentialName]
              return {
                ...current,
                state: {
                  ...current.state,
                  credentials: newCredentials
                }
              }
            })
          },
          searchCredentials: (query: SearchQuery, props?: string[]): any[] => {
            const credentialsStatesArray = Object.values(
              get().state.credentials
            )
            const credentialsArray = credentialsStatesArray.map(
              (cred) => cred.credential
            )

            const filteredCredentials = credentialsArray.filter(
              (credential) => {
                if (!credential) {
                  return false
                }
                return matchesQuery(credential, query)
              }
            )

            if (props && props.length) {
              const arrayOfArrays = filteredCredentials.map((credential) => {
                return props
                  .filter((prop) => credential && prop in credential)
                  .map((prop) => (credential as Record<string, any>)[prop])
              })

              return arrayOfArrays.flat()
            } else {
              return filteredCredentials
            }
          }
        }),
        {
          name: 'PalladCredential',
          storage: createJSONStorage(getSecurePersistence)
        }
      )
    )

    this.store = persistedStore
  }

  ensureCredential(
    credentialName: credentialName,
    keyAgentName: keyAgentName
  ): void {
    this.store.getState().ensureCredential(credentialName, keyAgentName)
  }

  setCredential(credentialState: SingleCredentialState): void {
    this.store.getState().setCredential(credentialState)
  }

  getCredential(
    credentialName: credentialName
  ): SingleCredentialState | typeof initialCredentialState {
    return this.store.getState().getCredential(credentialName)
  }

  removeCredential(credentialName: credentialName): void {
    this.store.getState().removeCredential(credentialName)
  }

  searchCredentials(query: SearchQuery, props?: string[]): storedCredential[] {
    return this.store.getState().searchCredentials(query, props)
  }

  rehydrate = async () => {
    await this.store.persist.rehydrate()
  }

  destroy = () => {
    this.store.destroy()
  }
}

export default CredentialStore
