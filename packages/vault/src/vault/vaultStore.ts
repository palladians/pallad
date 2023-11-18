import { getSecurePersistence } from '@palladxyz/persistence'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { accountSlice, AccountStore } from '../account'
import { credentialSlice, CredentialStore } from '../credentials'
import { keyAgentSlice, KeyAgentStore } from '../keyAgent'

export const useVault = create<
  AccountStore & CredentialStore & KeyAgentStore
>()(
  persist(
    (...all) => ({
      ...accountSlice(...all),
      ...credentialSlice(...all),
      ...keyAgentSlice(...all)
    }),
    { name: 'PalladVault', storage: createJSONStorage(getSecurePersistence) }
  )
)
