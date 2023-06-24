import { deriveKeyPair, generateMnemonic, wordlist } from '@palladxyz/mina'
import { produce } from 'immer'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { securePersistence } from '../lib/storage'

type PublicCredential = {
  walletName: string
  walletPublicKey: string
}

type Credential = PublicCredential & {
  walletPrivateKey: string
}

type VaultState = {
  currentWalletPublicKey: string | null
  credentials: Credential[]
}

type VaultMutators = {
  setCurrentWalletPublicKey: ({
    currentWalletPublicKey
  }: {
    currentWalletPublicKey: string | null
  }) => void
  addCredential: (credential: Credential) => void
  getAccounts: () => string[]
  getCurrentWallet: () => PublicCredential | null
  createWallet: ({
    walletName
  }: {
    walletName: string
  }) => Promise<{ publicKey: string; mnemonic: string } | null>
  restoreWallet: ({
    walletName,
    mnemonic
  }: {
    walletName: string
    mnemonic: string
  }) => Promise<{ publicKey: string } | null>
  reset: () => void
}

type VaultStore = VaultState & VaultMutators

const initialState = {
  currentWalletPublicKey: null,
  credentials: []
} satisfies VaultState

export const vaultStore = createStore<VaultStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getCurrentWallet() {
        const { currentWalletPublicKey, credentials } = get()
        const wallet = credentials.find(
          (credential) => credential.walletPublicKey === currentWalletPublicKey
        )
        if (!wallet) return null
        return {
          walletName: wallet?.walletName,
          walletPublicKey: wallet?.walletPublicKey
        }
      },
      getAccounts() {
        const { credentials } = get()
        return credentials.map((credential) => credential.walletPublicKey)
      },
      async createWallet({ walletName }) {
        const { addCredential, setCurrentWalletPublicKey } = get()
        const mnemonic = generateMnemonic(wordlist)
        const keypair = await deriveKeyPair({ mnemonic, accountNumber: 0 })
        if (!keypair) return null
        addCredential({
          walletName,
          walletPublicKey: keypair.publicKey,
          walletPrivateKey: keypair.privateKey
        })
        setCurrentWalletPublicKey({
          currentWalletPublicKey: keypair.publicKey
        })
        return {
          publicKey: keypair.publicKey,
          mnemonic
        }
      },
      async restoreWallet({ walletName, mnemonic }) {
        const { addCredential, setCurrentWalletPublicKey } = get()
        const keypair = await deriveKeyPair({ mnemonic, accountNumber: 0 })
        if (!keypair) return null
        addCredential({
          walletName,
          walletPublicKey: keypair.publicKey,
          walletPrivateKey: keypair.privateKey
        })
        setCurrentWalletPublicKey({
          currentWalletPublicKey: keypair.publicKey
        })
        return {
          publicKey: keypair.publicKey
        }
      },
      setCurrentWalletPublicKey: ({ currentWalletPublicKey }) =>
        set(
          produce((draft: VaultStore) => {
            if (currentWalletPublicKey === null) {
              draft.currentWalletPublicKey = null
              return
            }
            const credentialExists = draft.credentials.find(
              (credential: Credential) =>
                credential.walletPublicKey === currentWalletPublicKey
            )
            if (!credentialExists)
              throw new Error('Given credential does not exist')
            draft.currentWalletPublicKey = currentWalletPublicKey
          })
        ),
      addCredential: (credential) =>
        set(
          produce((draft: VaultStore) => {
            draft.credentials.push(credential)
          })
        ),
      reset() {
        return set(initialState)
      }
    }),
    {
      name: 'PalladVault',
      storage: createJSONStorage(() => securePersistence)
    }
  )
)

export const useVaultStore = (selector: any) => useStore(vaultStore, selector)
