import { Box, Button, Card, Text } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import Logo from '../../common/assets/logo.svg'
import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

export const AboutView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16 }}>
        <ViewHeading
          title="About"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Card
          css={{
            justifyContent: 'space-between',
            padding: '$md',
            flexDirection: 'row'
          }}
        >
          <Logo />
          <Button
            variant="link"
            css={{ backgroundColor: '$primary800', borderRadius: '32px' }}
          >
            Up to date
          </Button>
        </Card>
        <Box css={{ gap: 16 }}>
          <Box css={{ gap: 8 }}>
            <FormLabel>Current Version</FormLabel>
            <Text>v0.1.0</Text>
          </Box>
          <Box css={{ gap: 8 }}>
            <FormLabel>Commit Hash</FormLabel>
            <Text>9iufgds239803nf</Text>
          </Box>
        </Box>
        <Box>
          <Button variant="link">Terms of Service</Button>
          <Button variant="link">Privacy Policy</Button>
        </Box>
      </Box>
    </AppLayout>
  )
}
