import { useNavigate } from '@tanstack/router'
import { sessionData } from '@/lib/storage.ts'
import { useOnboardingStore } from '@/store/onboarding.ts'
import { WalletInfoForm } from '../components/WalletInfoForm.tsx'

export const RestoreWalletView = () => {
  const navigate = useNavigate()
  const setWalletName = useOnboardingStore((state) => state.setWalletName)
  const onSubmit = async ({ spendingPassword, walletName }: { spendingPassword: string; walletName: string }) => {
    await sessionData.set('spendingPassword', spendingPassword)
    setWalletName(walletName)
    return navigate({ to: '/mnemonic' })
  }
  return <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
}
