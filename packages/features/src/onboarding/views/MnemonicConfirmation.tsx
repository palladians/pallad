import { Box, Button, Input } from '@palladxyz/ui'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'
import { useOnboardingStore } from '../../wallet/store/onboarding'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
  const { wallet } = useWallet()
  console.log(wallet)
  const [confirmationIndex] = useState(getConfirmationIndex())
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized
  )
  const navigate = useNavigate()
  const mnemonic = useOnboardingStore((state) => state.mnemonic)
  const mnemonicSplit = useMemo(() => mnemonic?.split(' '), [mnemonic])
  const { control, handleSubmit, watch } = useForm({
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
    await setVaultStateInitialized()
    return navigate('/onboarding/finish')
  }
  return (
    <WizardLayout
      footer={
        <>
          <Button
            onPress={() => navigate(-1)}
            css={{ flex: 1, width: 'auto' }}
            testID="onboarding__backButton"
          >
            Back
          </Button>
          <Button
            variant="secondary"
            css={{
              flex: 1,
              width: 'auto',
              opacity: isValid ? 1 : 0.5,
              transition: 'opacity 0.3s'
            }}
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            testID="onboarding__nextButton"
          >
            Next
          </Button>
        </>
      }
    >
      <Box css={{ gap: 24 }}>
        <ViewHeading
          title="Confirm The Mnemonic"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ gap: 8 }}>
          <FormLabel testID="onboarding__writedownIndex">
            Type in the word #{confirmationIndex + 1}
          </FormLabel>
          <Controller
            control={control}
            name="mnemonicWord"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                onSubmitEditing={handleSubmit(onSubmit)}
                testID="onboarding__mnemonicConfirmationInput"
              />
            )}
          />
        </Box>
      </Box>
    </WizardLayout>
  )
}
