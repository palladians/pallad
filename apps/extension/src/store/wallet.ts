import { create } from 'zustand'

type Credential = {
  walletName: string
  walletPubKey: string
  walletPrivateKey: string
}

interface WalletState {
  currentWalletPubKey: string | null
  credentials: Credential[]
  setCurrentWalletPubKey: (currentWalletPubKey: string | null) => void
  addCredential: (credential: Credential) => void
}

export const useWalletStore = create<WalletState>((set, get) => ({
  currentWalletPubKey: null,
  credentials: [],
  setCurrentWalletPubKey(currentWalletPubKey) {
    if (currentWalletPubKey === null) return set({ currentWalletPubKey })
    const credentials = get().credentials
    const credentialExists = credentials.find((credential) => credential.walletPubKey === currentWalletPubKey)
    if (!credentialExists) throw new Error('Given credential does not exist')
    return set({ currentWalletPubKey })
  },
  addCredential(credential) {
    return set((current) => ({ credentials: [...current.credentials, credential] }))
  }
}))
