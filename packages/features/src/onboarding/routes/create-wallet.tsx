import { generateMnemonicWords } from '@palladxyz/key-management'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useOnboardingStore } from '@/common/store/onboarding'

import { CreateWalletView } from '../views/create-wallet'

export const CreateWalletRoute = () => {
  const navigate = useNavigate()
  const { setMnemonic, setWalletName, setSpendingPassword } =
    // TODO: fix this useOnboardingStore it is deprecated
    useOnboardingStore(
      (state) => ({
        setSpendingPassword: state.setSpendingPassword,
        setMnemonic: state.setMnemonic,
        setWalletName: state.setWalletName
      }),
      shallow
    )
  const onSubmit = ({
    spendingPassword,
    walletName
  }: {
    spendingPassword: string
    walletName: string
  }) => {
    setSpendingPassword(spendingPassword)
    setMnemonic(generateMnemonicWords(128).join(' '))
    setWalletName(walletName)
    return navigate('/onboarding/writedown')
  }
  return <CreateWalletView onSubmit={onSubmit} />
}
