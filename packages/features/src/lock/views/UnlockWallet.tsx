import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { sessionPersistence } from '../../common/lib/storage'
import { useVaultStore } from '../../common/store/vault'

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
    await useVaultStore.destroy()
    await useVaultStore.persist.rehydrate()
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
          <Text css={{ color: '$gray50' }}>Spending Password</Text>
          <Controller
            control={control}
            name="spendingPassword"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                css={{
                  color: '$white',
                  borderColor: '$gray600',
                  backgroundColor: '$gray800'
                }}
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
