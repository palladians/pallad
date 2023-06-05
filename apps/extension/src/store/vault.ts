import { create } from 'zustand'
import { produce } from 'immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storagePersistence } from '../lib/storage'
import { getMnemonic, deriveKeyPair } from '@palladxyz/mina'

type Credential = {
  walletName: string
  walletPubKey: string
  walletPrivateKey: string
}

type VaultState = {
  currentWalletPubKey: string | null
  credentials: Credential[]
}

type VaultMutators = {
  setCurrentWalletPubKey: ({ currentWalletPubKey }: { currentWalletPubKey: string | null }) => void
  addCredential: (credential: Credential) => void
  getCurrentWallet: () => Credential | undefined
  createWallet: ({ walletName }: { walletName: string }) => Promise<{ publicKey: string; mnemonic: string }>
  restoreWallet: ({ walletName, mnemonic }: { walletName: string; mnemonic: string }) => Promise<{ publicKey: string }>
  reset: () => void
}

type VaultStore = VaultState & VaultMutators

const initialState = {
  currentWalletPubKey: null,
  credentials: []
} satisfies VaultState

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getCurrentWallet() {
        const { currentWalletPubKey, credentials } = get()
        return credentials.find((credential) => credential.walletPubKey === currentWalletPubKey)
      },
      async createWallet({ walletName }) {
        const { addCredential, setCurrentWalletPubKey } = get()
        const mnemonic = getMnemonic()
        const keypair = await deriveKeyPair({ mnemonic })
        addCredential({
          walletName,
          walletPubKey: keypair.publicKey,
          walletPrivateKey: keypair.privateKey
        })
        setCurrentWalletPubKey({ currentWalletPubKey: keypair.publicKey })
        return {
          publicKey: keypair.publicKey,
          mnemonic
        }
      },
      async restoreWallet({ walletName, mnemonic }) {
        const { addCredential, setCurrentWalletPubKey } = get()
        const keypair = await deriveKeyPair({ mnemonic })
        addCredential({
          walletName,
          walletPubKey: keypair.publicKey,
          walletPrivateKey: keypair.privateKey
        })
        setCurrentWalletPubKey({ currentWalletPubKey: keypair.publicKey })
        return {
          publicKey: keypair.publicKey
        }
      },
      setCurrentWalletPubKey: ({ currentWalletPubKey }) =>
        set(
          produce((draft: VaultStore) => {
            if (currentWalletPubKey === null) {
              draft.currentWalletPubKey = null
              return
            }
            const credentialExists = draft.credentials.find(
              (credential: Credential) => credential.walletPubKey === currentWalletPubKey
            )
            if (!credentialExists) throw new Error('Given credential does not exist')
            draft.currentWalletPubKey = currentWalletPubKey
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
    { name: 'PalladVault', storage: createJSONStorage(() => storagePersistence) }
  )
)
