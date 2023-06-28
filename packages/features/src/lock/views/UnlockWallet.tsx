import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { sessionPersistence } from '../../common/lib/storage'
import { useVaultStore, vaultStore } from '../../common/store/vault'

export const UnlockWalletView = () => {
  const [passwordError, setPasswordError] = useState(false)
  const navigate = useNavigate()
  const getCurrentWallet = useVaultStore((state) => state.getCurrentWallet)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      spendingPassword: ''
    }
  })
  const onError = async () => {
    await sessionPersistence.setItem('spendingPassword', '')
    return setPasswordError(true)
  }
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await sessionPersistence.setItem('spendingPassword', spendingPassword)
    await vaultStore.destroy()
    await vaultStore.persist.rehydrate()
    const wallet = await getCurrentWallet()
    if (!wallet) return await onError()
    return navigate('/dashboard')
  }
  return (
    <WizardLayout
      footer={<Button onPress={handleSubmit(onSubmit)}>Unlock</Button>}
    >
      <Box css={{ gap: 24 }}>
        <Heading size="lg" css={{ color: '$white' }}>
          Unlock Wallet
        </Heading>
        {passwordError && (
          <Text
            css={{
              backgroundColor: '$red500',
              color: '$gray50',
              padding: 8,
              borderRadius: 4
            }}
          >
            The password is wrong
          </Text>
        )}
        <Box css={{ gap: 8 }}>
          <FormLabel>Spending Password</FormLabel>
          <Controller
            control={control}
            name="spendingPassword"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                onSubmitEditing={handleSubmit(onSubmit)}
                secureTextEntry
                autoFocus
              />
            )}
          />
        </Box>
      </Box>
    </WizardLayout>
  )
}
