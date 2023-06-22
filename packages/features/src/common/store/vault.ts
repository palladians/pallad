import { deriveKeyPair, generateMnemonic, wordlist } from '@palladxyz/mina'
import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

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
  getCurrentWallet: () => PublicCredential | null
  createWallet: ({
    walletName
  }: {
    walletName: string
  }) => Promise<{ publicKey: string; mnemonic: string }>
  restoreWallet: ({
    walletName,
    mnemonic
  }: {
    walletName: string
    mnemonic: string
  }) => Promise<{ publicKey: string }>
  reset: () => void
}

type VaultStore = VaultState & VaultMutators

const initialState = {
  currentWalletPublicKey: null,
  credentials: []
} satisfies VaultState

export const useVaultStore = create<VaultStore>()(
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
      async createWallet({ walletName }) {
        const { addCredential, setCurrentWalletPublicKey } = get()
        const mnemonic = generateMnemonic(wordlist)
        const keypair = await deriveKeyPair({ mnemonic })
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
        const keypair = await deriveKeyPair({ mnemonic })
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
