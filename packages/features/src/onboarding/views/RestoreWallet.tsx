import { getSessionPersistence } from '@palladxyz/persistence'
import { useNavigate } from 'react-router-native'

import { useOnboardingStore } from '../../wallet/store/onboarding'
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
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    setWalletName(walletName)
    return navigate('/onboarding/mnemonic')
  }
  return <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
}
