import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { CredentialStore, initialCredentialState } from './credentialsState'
import { matchesQuery } from './utils'

export const credentialSlice: StateCreator<CredentialStore> = (set, get) => ({
  credentials: {},
  ensureCredential: (credentialName, keyAgentName) => {
    set(
      produce((state) => {
        if (!state.credentials?.[credentialName]) {
          state.credentials[credentialName] = {
            ...initialCredentialState,
            credentialName: credentialName,
            keyAgentName: keyAgentName
          }
        }
      })
    )
  },
  setCredential: (credentialState) => {
    const { credentialName } = credentialState
    set(
      produce((state) => {
        state.credentials[credentialName] = credentialState
      })
    )
  },
  getCredential: (credentialName) => {
    const { credentials } = get()
    return credentials[credentialName] || initialCredentialState
  },
  removeCredential: (credentialName) => {
    set(
      produce((state) => {
        delete state.credentials[credentialName]
      })
    )
  },
  searchCredentials: (query, props) => {
    const { credentials } = get()
    const credentialsStatesArray = Object.values(credentials)
    const credentialsArray = credentialsStatesArray.map(
      (cred) => cred.credential
    )
    const filteredCredentials = credentialsArray.filter((credential) => {
      if (!credential) {
        return false
      }
      return matchesQuery(credential, query)
    })
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
  },
  clear: () => {
    set(
      produce((state) => {
        state.credentials = {}
      })
    )
  }
})
