import { Box, Button, Checkbox, Heading, Text } from '@palladxyz/ui'
import { WizardLayout } from '@/components'
import { useState } from 'react'
import { useNavigate } from '@tanstack/router'
import { useOnboardingStore } from '@/store/onboarding.ts'
import { Pressable } from 'react-native'

export const MnemonicWritedownView = () => {
  const navigate = useNavigate()
  const mnemonic = useOnboardingStore((state) => state.mnemonic?.split(' '))
  const [noOneIsLooking, setNoOneIsLooking] = useState(false)
  const [mnemonicWrote, setMnemonicWrote] = useState(false)
  const toggleMnemonicWrote = () => setMnemonicWrote(!mnemonicWrote)
  return (
    <WizardLayout
      footer={
        <>
          <Button onPress={() => navigate({ to: '/start' })} css={{ flex: 1, width: 'auto' }}>
            Back
          </Button>
          <Button
            variant="secondary"
            css={{ flex: 1, width: 'auto', opacity: mnemonicWrote ? 1 : 0.5, transition: 'opacity 0.3s' }}
            disabled={!mnemonicWrote}
            onPress={() => navigate({ to: '/confirmation' })}
          >
            Next
          </Button>
        </>
      }
    >
      <Box css={{ gap: 24 }}>
        <Heading size="lg" css={{ color: '$white' }}>
          Write Down The Mnemonic
        </Heading>
        {noOneIsLooking ? (
          <Box css={{ gap: 16 }}>
            <Text css={{ color: '$gray50' }}>Write This Down</Text>
            <Box css={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {mnemonic?.map((word, i) => (
                <Text
                  key={i}
                  css={{
                    backgroundColor: '$secondary600',
                    color: '$white',
                    width: 'auto',
                    paddingHorizontal: '$md',
                    paddingVertical: '$sm',
                    borderRadius: 32,
                    fontSize: 14
                  }}
                >
                  {word}
                </Text>
              ))}
            </Box>
            <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Checkbox value={mnemonicWrote} onValueChange={(value: boolean) => setMnemonicWrote(value)} />
              <Pressable onPress={toggleMnemonicWrote}>
                <Text css={{ color: '$gray50' }}>I have written down the mnemonic.</Text>
              </Pressable>
            </Box>
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
