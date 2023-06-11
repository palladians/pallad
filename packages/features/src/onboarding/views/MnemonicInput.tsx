import { validateMnemonic } from '@palladxyz/mina'
import { Box, Button, Heading, Text, Textarea } from '@palladxyz/ui'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { VaultState } from '../../common/lib/const'
import { useLocalWallet } from '../../common/lib/hooks'
import { useOnboardingStore } from '../../common/store/onboarding'
import { useVaultStore } from '../../common/store/vault'

export const MnemonicInputView = () => {
  const navigate = useNavigate()
  const walletName = useOnboardingStore((state) => state.walletName)
  const restoreWallet = useVaultStore((state) => state.restoreWallet)
  const [, setWallet] = useLocalWallet()
  const [noOneIsLooking, setNoOneIsLooking] = useState(false)
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      mnemonic: ''
    }
  })
  const mnemonic = watch('mnemonic')
  const mnemonicValid = useMemo(() => validateMnemonic(mnemonic), [mnemonic])
  const onSubmit = async ({ mnemonic }: { mnemonic: string }) => {
    if (!walletName) return
    await restoreWallet({ mnemonic, walletName })
    await setWallet({
      vaultState: VaultState[VaultState.INITIALIZED]
    })
    return navigate('/dashboard')
  }
  return (
    <WizardLayout
      footer={
        <>
          <Button
            onPress={() => navigate('/')}
            css={{ flex: 1, width: 'auto' }}
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
                />
              )}
            />
          </Box>
        ) : (
          <Box css={{ gap: 8 }}>
            <Text css={{ color: '$gray50' }}>Confirm No One Is Behind You</Text>
            <Button onPress={() => setNoOneIsLooking(true)}>I am alone</Button>
          </Box>
        )}
      </Box>
    </WizardLayout>
  )
}
