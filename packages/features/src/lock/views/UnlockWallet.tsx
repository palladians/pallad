import { getSessionPersistence } from '@palladxyz/persistence'
import { Box, Button, Icons, Input, Text, theme } from '@palladxyz/ui'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useViewAnimation } from '../../common/lib/animation'

export const UnlockWalletView = () => {
  const { shift, opacity, scale } = useViewAnimation()
  const [passwordError, setPasswordError] = useState(false)
  console.log('>>PE', setPasswordError)
  const navigate = useNavigate()
  // const getCurrentWallet = useVaultStore((state) => state.getCurrentWallet)
  // const resetWallet = useVaultStore((state) => state.reset)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      spendingPassword: ''
    }
  })
  // const onError = async () => {
  //   await getSessionPersistence().setItem('spendingPassword', '')
  //   return setPasswordError(true)
  // }
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    // await vaultStore.destroy()
    // await vaultStore.persist.rehydrate()
    // const wallet = await getCurrentWallet()
    // if (!wallet) return await onError()
    return navigate('/dashboard')
  }
  const restartWallet = () => {
    // resetWallet()
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
          <Box
            css={{
              backgroundColor: '$red800',
              padding: '$sm',
              borderRadius: '$md',
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Icons.AlertCircle color={theme.colors.red400.value} />
            <Text css={{ color: '$red400' }}>The password is wrong</Text>
          </Box>
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
