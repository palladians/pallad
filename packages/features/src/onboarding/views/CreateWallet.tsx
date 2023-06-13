import { useNavigate } from 'react-router-native'

import { useOnboardingStore } from '../../common/store/onboarding'
import { useVaultStore } from '../../common/store/vault'
import { WalletInfoForm } from '../components/WalletInfoForm'
import { sessionPersistence } from '../../common/lib/storage'

export const CreateWalletView = () => {
  const navigate = useNavigate()
  const createWallet = useVaultStore((state) => state.createWallet)
  const setMnemonic = useOnboardingStore((state) => state.setMnemonic)
  const onSubmit = async ({
    spendingPassword,
    walletName
  }: {
    spendingPassword: string
    walletName: string
  }) => {
    await sessionPersistence.setItem('spendingPassword', spendingPassword)
    const wallet = await createWallet({ walletName })
    setMnemonic(wallet.mnemonic)
    return navigate('/writedown')
  }
  return <WalletInfoForm title="Create Wallet" onSubmit={onSubmit} />
}
