import { getSessionPersistence } from '@palladxyz/persistence'
import { useNavigate } from 'react-router-dom'

import { useWallet } from '../../wallet/hooks/useWallet'
import { useOnboardingStore } from '../../wallet/store/onboarding'
import { WalletInfoForm } from '../components/WalletInfoForm'

export const CreateWalletView = () => {
  // const { wallet } = useWallet()
  // console.log(wallet)
  const navigate = useNavigate()
  const setMnemonic = useOnboardingStore((state) => state.setMnemonic)
  const onSubmit = async ({
    spendingPassword,
    walletName
  }: {
    spendingPassword: string
    walletName: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    console.log('>>>WN', walletName)
    // const wallet = await createWallet({
    //   walletName,
    //   network: Network.Mina,
    //   accountNumber: 0
    // })
    // setMnemonic(wallet.mnemonic)
    return navigate('/onboarding/writedown')
  }
  return <WalletInfoForm title="Create Wallet" onSubmit={onSubmit} />
}
