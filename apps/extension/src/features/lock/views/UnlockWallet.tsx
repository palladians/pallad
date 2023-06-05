import { WizardLayout } from '@/components/WizardLayout'
import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from '@tanstack/router'
import { sessionData } from '@/lib/storage.ts'

export const UnlockWalletView = () => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      spendingPassword: ''
    }
  })
  const onSubmit = async ({ spendingPassword }: { spendingPassword: string }) => {
    await sessionData.set('spendingPassword', spendingPassword)
    return navigate({ to: '/' })
  }
  return (
    <WizardLayout footer={<Button onPress={handleSubmit(onSubmit)}>Unlock</Button>}>
      <Box css={{ gap: 24 }}>
        <Heading size="lg" css={{ color: '$white' }}>
          Unlock Wallet
        </Heading>
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
