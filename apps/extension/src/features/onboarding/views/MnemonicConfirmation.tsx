import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'
import { WizardLayout } from '@/components'
import { useNavigate } from '@tanstack/router'
import { useOnboardingStore } from '@/store/onboarding'
import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { VaultState } from '@/lib/const.ts'
import { useLocalWallet } from '@/lib/hooks.ts'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
  const [confirmationIndex] = useState(getConfirmationIndex())
  const [, setWallet] = useLocalWallet()
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
    await setWallet({
      vaultState: VaultState[VaultState.INITIALIZED]
    })
    return navigate({ to: '/' })
  }
  return (
    <WizardLayout
      footer={
        <>
          <Button onPress={() => navigate({ to: '/start' })} css={{ flex: 1, width: 'auto' }}>
            Back
          </Button>
          <Button
            variant="secondary"
            css={{ flex: 1, width: 'auto', opacity: isValid ? 1 : 0.5, transition: 'opacity 0.3s' }}
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
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
          <Text css={{ color: '$gray50' }}>Type in the word #{confirmationIndex + 1}</Text>
          <Controller
            control={control}
            name="mnemonicWord"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                css={{ color: '$white', borderColor: '$gray600', backgroundColor: '$gray800' }}
              />
            )}
          />
        </Box>
      </Box>
    </WizardLayout>
  )
}
