import { generateMnemonicWords } from '@palladxyz/key-management'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useOnboardingStore } from '../../wallet/store/onboarding'
import { WalletInfoForm } from '../components/WalletInfoForm'

export const CreateWalletView = () => {
  const navigate = useNavigate()
  const { setMnemonic, setSpendingPassword } = useOnboardingStore(
    (state) => ({
      setSpendingPassword: state.setSpendingPassword,
      setMnemonic: state.setMnemonic
    }),
    shallow
  )
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
    walletName: string
  }) => {
    setSpendingPassword(spendingPassword)
    setMnemonic(generateMnemonicWords(128).join(' '))
    return navigate('/onboarding/writedown')
  }
  return <WalletInfoForm title="Create Wallet" onSubmit={onSubmit} />
}
