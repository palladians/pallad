import { Box, Button, Checkbox, Input, Text } from '@palladxyz/ui'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

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
          <Button
            onPress={() => navigate(-1)}
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
              opacity: termsAccepted ? 1 : 0.5,
              transition: 'opacity 0.3s'
            }}
            disabled={!termsAccepted}
            onPress={handleSubmit(onSubmit)}
            testID="onboarding__nextButton"
          >
            Next
          </Button>
        </>
      }
    >
      <Box css={{ gap: 24 }}>
        <ViewHeading
          title={title}
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ gap: 8 }}>
          <FormLabel>Wallet Name</FormLabel>
          <Controller
            control={control}
            name="walletName"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                onSubmitEditing={handleSubmit(onSubmit)}
                placeholder="Wallet Name"
                testID="onboarding__walletNameInput"
              />
            )}
          />
        </Box>
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
                testID="onboarding__spendingPasswordInput"
                placeholder="Password"
                secureTextEntry
              />
            )}
          />
        </Box>
        <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Checkbox
            value={termsAccepted}
            onValueChange={(value: boolean) => setTermsAccepted(value)}
            testID="onboarding__tosCheckbox"
          />
          <Pressable onPress={toggleAccepted}>
            <Text css={{ color: '$gray50' }}>I accept Terms of Service.</Text>
          </Pressable>
        </Box>
      </Box>
    </WizardLayout>
  )
}
