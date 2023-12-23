import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useOnboardingStore } from '@/common/store/onboarding'

import { WalletInfoForm } from '../components/wallet-info-form'

export const RestoreWalletView = () => {
  const navigate = useNavigate()
  const { setWalletName, setSpendingPassword } = useOnboardingStore(
    (state) => ({
      setWalletName: state.setWalletName,
      setSpendingPassword: state.setSpendingPassword
    }),
    shallow
  )
  const onSubmit = async ({
    spendingPassword,
    walletName
  }: {
    spendingPassword: string
    walletName: string
  }) => {
    setSpendingPassword(spendingPassword)
    setWalletName(walletName)
    return navigate('/onboarding/mnemonic')
  }
  return <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
}
