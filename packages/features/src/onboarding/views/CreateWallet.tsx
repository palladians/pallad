import { Network } from '@palladxyz/key-generator'
import { useNavigate } from 'react-router-native'

import { getSessionPersistence } from '../../common/lib/storage'
import { useOnboardingStore } from '../../common/store/onboarding'
import { useVaultStore } from '../../common/store/vault'
import { WalletInfoForm } from '../components/WalletInfoForm'

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
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    const wallet = await createWallet({
      walletName,
      network: Network.Mina,
      accountNumber: 0
    })
    setMnemonic(wallet.mnemonic)
    return navigate('/writedown')
  }
  return <WalletInfoForm title="Create Wallet" onSubmit={onSubmit} />
}
