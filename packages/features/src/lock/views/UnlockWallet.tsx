import { Box, Button, Input, Text } from '@palladxyz/ui'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useViewAnimation } from '../../common/lib/animation'
import { getSessionPersistence } from '../../common/lib/storage'
import { useVaultStore, vaultStore } from '../../common/store/vault'

export const UnlockWalletView = () => {
  const { shift, opacity, scale } = useViewAnimation()
  const [passwordError, setPasswordError] = useState(false)
  const navigate = useNavigate()
  const getCurrentWallet = useVaultStore((state) => state.getCurrentWallet)
  const resetWallet = useVaultStore((state) => state.reset)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      spendingPassword: ''
    }
  })
  const onError = async () => {
    await getSessionPersistence().setItem('spendingPassword', '')
    return setPasswordError(true)
  }
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    await vaultStore.destroy()
    await vaultStore.persist.rehydrate()
    const wallet = await getCurrentWallet()
    if (!wallet) return await onError()
    return navigate('/dashboard')
  }
  const restartWallet = () => {
    resetWallet()
    navigate('/')
  }
  return (
    <WizardLayout
      footer={
        <Button onPress={handleSubmit(onSubmit)} css={{ flex: 1 }}>
          Unlock
        </Button>
      }
    >
      <Box
        css={{ gap: 24 }}
        style={{ opacity, marginTop: shift, transform: [{ scale }] }}
      >
        <ViewHeading
          title="Unlock Wallet"
          button={{
            label: 'Restart Wallet',
            onPress: restartWallet
          }}
        />
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
