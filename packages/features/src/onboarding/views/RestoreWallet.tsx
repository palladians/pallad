import { useNavigate } from 'react-router-native'

import { useOnboardingStore } from '../../common/store/onboarding'
import { WalletInfoForm } from '../components/WalletInfoForm'
import { sessionPersistence } from '../../common/lib/storage'

export const RestoreWalletView = () => {
  const navigate = useNavigate()
  const setWalletName = useOnboardingStore((state) => state.setWalletName)
  const onSubmit = async ({
    spendingPassword,
    walletName
  }: {
    spendingPassword: string
    walletName: string
  }) => {
    await sessionPersistence.setItem('spendingPassword', spendingPassword)
    setWalletName(walletName)
    return navigate('/mnemonic')
  }
  return <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
}
