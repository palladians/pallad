import React from 'react'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useOnboardingStore } from '@/common/store/onboarding'

import { RestoreWalletView } from '../views/restore-wallet'

export const RestoreWalletRoute = () => {
  const navigate = useNavigate()
  const { setWalletName, setSpendingPassword } = useOnboardingStore(
    (state) => ({
      setWalletName: state.setWalletName,
      setSpendingPassword: state.setSpendingPassword
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
    setWalletName(walletName)
    return navigate('/onboarding/mnemonic')
  }
  return <RestoreWalletView onSubmit={onSubmit} />
}
