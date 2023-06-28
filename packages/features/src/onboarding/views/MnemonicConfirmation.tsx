import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { VaultState } from '../../common/lib/const'
import { useAppStore } from '../../common/store/app'
import { useOnboardingStore } from '../../common/store/onboarding'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
  const [confirmationIndex] = useState(getConfirmationIndex())
  const setVaultState = useAppStore((state) => state.setVaultState)
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
    await setVaultState(VaultState[VaultState.INITIALIZED])
    return navigate('/dashboard')
  }
  return (
    <WizardLayout
      footer={
        <>
          <Button
            onPress={() => navigate('/')}
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
        <Heading size="lg" css={{ color: '$white' }}>
          Confirm The Mnemonic
        </Heading>
        <Box css={{ gap: 16 }}>
          <Text css={{ color: '$gray50' }} testID="onboarding__writedownIndex">
            Type in the word #{confirmationIndex + 1}
          </Text>
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
