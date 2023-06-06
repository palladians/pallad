import { useNavigate } from '@tanstack/router'
import { sessionData } from '@/lib/storage.ts'
import { useVaultStore } from '@/store/vault.ts'
import { useOnboardingStore } from '@/store/onboarding.ts'
import { WalletInfoForm } from '../components/WalletInfoForm.tsx'

export const CreateWalletView = () => {
  const navigate = useNavigate()
  const createWallet = useVaultStore((state) => state.createWallet)
  const setMnemonic = useOnboardingStore((state) => state.setMnemonic)
  const onSubmit = async ({ spendingPassword, walletName }: { spendingPassword: string; walletName: string }) => {
    await sessionData.set('spendingPassword', spendingPassword)
    const wallet = await createWallet({ walletName })
    setMnemonic(wallet.mnemonic)
    return navigate({ to: '/writedown' })
  }
  return <WalletInfoForm title="Create Wallet" onSubmit={onSubmit} />
}
