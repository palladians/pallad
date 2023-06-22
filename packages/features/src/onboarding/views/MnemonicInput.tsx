import { validateMnemonic, wordlist } from '@palladxyz/mina'
import { Box, Button, Heading, Text, Textarea } from '@palladxyz/ui'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { VaultState } from '../../common/lib/const'
import { useAppStore } from '../../common/store/app'
import { useOnboardingStore } from '../../common/store/onboarding'
import { useVaultStore } from '../../common/store/vault'

export const MnemonicInputView = () => {
  const navigate = useNavigate()
  const walletName = useOnboardingStore((state) => state.walletName)
  const restoreWallet = useVaultStore((state) => state.restoreWallet)
  const setVaultState = useAppStore((state) => state.setVaultState)
  const [noOneIsLooking, setNoOneIsLooking] = useState(false)
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      mnemonic: ''
    }
  })
  const mnemonic = watch('mnemonic')
  const mnemonicValid = useMemo(
    () => validateMnemonic(mnemonic, wordlist),
    [mnemonic]
  )
  const onSubmit = async ({ mnemonic }: { mnemonic: string }) => {
    if (!walletName) return
    await restoreWallet({ mnemonic, walletName })
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
              opacity: mnemonicValid ? 1 : 0.5,
              transition: 'opacity 0.3s'
            }}
            disabled={!mnemonicValid}
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
          Type In Your Mnemonic
        </Heading>
        {noOneIsLooking ? (
          <Box css={{ gap: 16 }}>
            <Text css={{ color: '$gray50' }}>Your Mnemonic</Text>
            <Controller
              control={control}
              name="mnemonic"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  css={{
                    color: '$white',
                    borderColor: '$gray600',
                    backgroundColor: '$gray800',
                    lineHeight: '175%'
                  }}
                  testID="onboarding__yourMnemonicTextarea"
                />
              )}
            />
          </Box>
        ) : (
          <Box css={{ gap: 8 }}>
            <Text css={{ color: '$gray50' }}>Confirm No One Is Behind You</Text>
            <Button
              onPress={() => setNoOneIsLooking(true)}
              testID="onboarding__confirmAlone"
            >
              I am alone
            </Button>
          </Box>
        )}
      </Box>
    </WizardLayout>
  )
}
