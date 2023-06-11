import { useNavigate } from 'react-router-native'

import { sessionData } from '../../common/lib/storage'
import { useOnboardingStore } from '../../common/store/onboarding'
import { WalletInfoForm } from '../components/WalletInfoForm'

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
    await sessionData.set('spendingPassword', spendingPassword)
    setWalletName(walletName)
    return navigate('/mnemonic')
  }
  return <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
}
