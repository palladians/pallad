import { Heading, Button, Box, Text, Input, Checkbox } from '@palladxyz/ui'
import { WizardLayout } from '@/components/WizardLayout'
import { useNavigate } from '@tanstack/router'
import { useState } from 'react'
import { Pressable } from 'react-native'

export const CreateWalletView = () => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleAccepted = () => setTermsAccepted(!termsAccepted)
  const navigate = useNavigate()
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
          >
            Next
          </Button>
        </>
      }
    >
      <Box css={{ gap: 24 }}>
        <Heading size="lg" css={{ color: '$white' }}>
          Create Wallet
        </Heading>
        <Box css={{ gap: 8 }}>
          <Text css={{ color: '$gray50' }}>Wallet Name</Text>
          <Input css={{ color: '$white', borderColor: '$gray600', backgroundColor: '$gray800' }} />
        </Box>
        <Box css={{ gap: 8 }}>
          <Text css={{ color: '$gray50' }}>Spending Password</Text>
          <Input css={{ color: '$white', borderColor: '$gray600', backgroundColor: '$gray800' }} secureTextEntry />
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
