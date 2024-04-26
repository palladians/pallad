import { create } from "zustand"

type Mnemonic = string | null

type OnboardingState = {
  mnemonic: Mnemonic
  spendingPassword: string | null
  walletName: string | null
}

type OnboardingMutators = {
  setMnemonic: (mnemonic: Mnemonic) => void
  setSpendingPassword: (spendingPassword: string | null) => void
  setWalletName: (walletName: string | null) => void
}

type OnboardingStore = OnboardingState & OnboardingMutators

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  mnemonic: null,
  spendingPassword: null,
  walletName: null,
  setMnemonic(mnemonic) {
    return set({ mnemonic })
  },
  setSpendingPassword(spendingPassword) {
    return set({ spendingPassword })
  },
  setWalletName(walletName: string | null) {
    return set({ walletName })
  },
}))
