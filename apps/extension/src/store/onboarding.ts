import { create } from 'zustand'

type Mnemonic = string | null

type OnboardingState = {
  mnemonic: Mnemonic
  walletName: string | null
}

type OnboardingMutators = {
  setMnemonic: (mnemonic: Mnemonic) => void
  setWalletName: (walletName: string | null) => void
}

type OnboardingStore = OnboardingState & OnboardingMutators

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  mnemonic: null,
  walletName: null,
  setMnemonic(mnemonic) {
    return set({ mnemonic })
  },
  setWalletName(walletName: string | null) {
    return set({ walletName })
  }
}))
