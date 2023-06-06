import { WizardLayout } from '@/components'
import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from '@tanstack/router'
import { sessionData } from '@/lib/storage.ts'
import { useVaultStore } from '@/store/vault.ts'
import { useState } from 'react'

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
    await sessionData.set('spendingPassword', null)
    return setPasswordError(true)
  }
  const onSubmit = async ({ spendingPassword }: { spendingPassword: string }) => {
    await sessionData.set('spendingPassword', spendingPassword)
    await useVaultStore.destroy()
    await useVaultStore.persist.rehydrate()
    const wallet = await getCurrentWallet()
    if (!wallet) return await onError()
    return navigate({ to: '/' })
  }
  return (
    <WizardLayout footer={<Button onPress={handleSubmit(onSubmit)}>Unlock</Button>}>
      <Box css={{ gap: 24 }}>
        <Heading size="lg" css={{ color: '$white' }}>
          Unlock Wallet
        </Heading>
        {passwordError && (
          <Text css={{ backgroundColor: '$red500', color: '$gray50', padding: 8, borderRadius: 4 }}>
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
                css={{ color: '$white', borderColor: '$gray600', backgroundColor: '$gray800' }}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
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
