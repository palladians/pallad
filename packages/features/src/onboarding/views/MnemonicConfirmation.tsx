import {
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { getSessionPersistence } from '@palladxyz/persistence'
import { Button, cn, Input, Label } from '@palladxyz/ui'
import { useVault } from '@palladxyz/vault'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWalletUi } from '../../common/hooks/useWalletUi'
import { useAppStore } from '../../common/store/app'
import { useOnboardingStore } from '../../common/store/onboarding'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
  const { restoreWallet } = useWalletUi()
  const [confirmationIndex] = useState(getConfirmationIndex())
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized
  )
  const navigate = useNavigate()
  const { spendingPassword, walletName, mnemonic } = useOnboardingStore(
    (state) => ({
      spendingPassword: state.spendingPassword,
      walletName: state.walletName,
      mnemonic: state.mnemonic
    })
  )
  const mnemonicSplit = useMemo(() => mnemonic?.split(' '), [mnemonic])
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      mnemonicWord: ''
    }
  })
  const mnemonicWord = watch('mnemonicWord')
  const isValid = useMemo(
    () => mnemonicSplit?.[confirmationIndex] === mnemonicWord,
    [mnemonicWord, mnemonicSplit, confirmationIndex]
  )
  const onSubmit = async () => {
    if (!walletName) return
    if (!spendingPassword) return
    if (!mnemonic) return
    getSessionPersistence().setItem('spendingPassword', spendingPassword)
    useVault.destroy()
    useVault.persist.rehydrate()
    // TODO: Add await in UI when user clicks restore wallet
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet' // TODO: make this configurable
    }
    await restoreWallet(
      new MinaPayload(),
      restoreArgs,
      Mina.Networks.MAINNET,
      {
        mnemonicWords: mnemonic.split(' '),
        getPassphrase: async () => Buffer.from(spendingPassword)
      },
      walletName //this is the keyAgentName
    )
    setVaultStateInitialized()
    return navigate('/onboarding/finish')
  }
  return (
    <WizardLayout
      footer={
        <Button
          type="submit"
          form="mnemonicConfirmationForm"
          variant="secondary"
          className={cn([
            'flex-1 opacity-50 transition-opacity',
            isValid && 'opacity-100'
          ])}
          disabled={!isValid}
          data-testid="onboarding__nextButton"
        >
          Next
        </Button>
      }
    >
      <form
        className="flex flex-col flex-1 gap-6"
        id="mnemonicConfirmationForm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <ViewHeading
          title="Confirm The Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 gap-4">
          <Label data-testid="onboarding__writedownIndex">
            Type in the word #{confirmationIndex + 1}
          </Label>
          <Input
            data-testid="onboarding__mnemonicConfirmationInput"
            {...register('mnemonicWord')}
          />
        </div>
      </form>
    </WizardLayout>
  )
}
