import { Box, Button, icons, Text } from '@palladxyz/ui'
import { Linking } from 'react-native'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'

export const StayConnectedView = () => {
  const navigate = useNavigate()
  const openDiscord = () => Linking.openURL('https://discord.gg/ExzzfTGUnB')
  const openTwitter = () => Linking.openURL('https://twitter.com/pallad_xyz')
  return (
    <WizardLayout
      footer={
        <>
          <Button
            variant="secondary"
            css={{
              flex: 1,
              width: 'auto'
            }}
            onPress={() => navigate('/dashboard')}
            testID="onboarding__nextButton"
          >
            Go to Dashboard
          </Button>
        </>
      }
    >
      <Box css={{ gap: 24 }}>
        <ViewHeading title="Stay Connected" />
        <Text css={{ lineHeight: '200%' }}>
          That's it. Before moving to Dashboard consider joining our Community.
        </Text>
        <Box css={{ gap: 8, flexDirection: 'row' }}>
          <Button
            leftIcon={icons.iconDiscord}
            css={{ flex: 1 }}
            onPress={openDiscord}
          >
            Discord
          </Button>
          <Button
            leftIcon={icons.iconTwitter}
            css={{ flex: 1 }}
            onPress={openTwitter}
          >
            Twitter
          </Button>
        </Box>
      </Box>
    </WizardLayout>
  )
}
