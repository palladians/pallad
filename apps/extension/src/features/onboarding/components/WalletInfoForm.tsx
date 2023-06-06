import { Box, Button, Checkbox, Heading, Input, Text } from '@palladxyz/ui'
import { Controller, useForm } from 'react-hook-form'
import { Pressable } from 'react-native'
import { WizardLayout } from '@/components'
import { useNavigate } from '@tanstack/router'
import { useState } from 'react'

interface WalletInfoFormProps {
  title: string
  onSubmit: (data: { spendingPassword: string; walletName: string }) => void
}

export const WalletInfoForm = ({ title, onSubmit }: WalletInfoFormProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleAccepted = () => setTermsAccepted(!termsAccepted)
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      walletName: '',
      spendingPassword: ''
    }
  })
  return (
    <WizardLayout
      footer={
        <>
          <Button onPress={() => navigate({ to: '/start' })} css={{ flex: 1, width: 'auto' }}>
            Back
          </Button>
          <Button
            variant="secondary"
            css={{ flex: 1, width: 'auto', opacity: termsAccepted ? 1 : 0.5, transition: 'opacity 0.3s' }}
            disabled={!termsAccepted}
            onPress={handleSubmit(onSubmit)}
          >
            Next
          </Button>
        </>
      }
    >
      <Box css={{ gap: 24 }}>
        <Heading size="lg" css={{ color: '$white' }}>
          {title}
        </Heading>
        <Box css={{ gap: 8 }}>
          <Text css={{ color: '$gray50' }}>Wallet Name</Text>
          <Controller
            control={control}
            name="walletName"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                css={{ color: '$white', borderColor: '$gray600', backgroundColor: '$gray800' }}
              />
            )}
          />
        </Box>
        <Box css={{ gap: 8 }}>
          <Text css={{ color: '$gray50' }}>Spending Password</Text>
          <Controller
            control={control}
            name="spendingPassword"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                css={{ color: '$white', borderColor: '$gray600', backgroundColor: '$gray800' }}
                secureTextEntry
              />
            )}
          />
        </Box>
        <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Checkbox value={termsAccepted} onValueChange={(value: boolean) => setTermsAccepted(value)} />
          <Pressable onPress={toggleAccepted}>
            <Text css={{ color: '$gray50' }}>I accept Terms of Service.</Text>
          </Pressable>
        </Box>
      </Box>
    </WizardLayout>
  )
}
