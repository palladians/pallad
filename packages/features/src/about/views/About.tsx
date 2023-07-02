import { Box, Button, Card, Text } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import packageJson from '../../../package.json'
import Logo from '../../common/assets/logo.svg'
import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'

const AppMeta = [
  {
    label: 'Current Version',
    value: packageJson.version
  },
  {
    label: 'Commit Hash',
    value: '9iufgds239803nf'
  }
]

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
            alignItems: 'center',
            padding: '$md',
            flexDirection: 'row'
          }}
        >
          <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Logo />
            <Text css={{ fontWeight: '$semibold' }}>Pallad</Text>
          </Box>
          <Button
            variant="link"
            css={{ backgroundColor: '$primary800', borderRadius: '32px' }}
          >
            Up to date
          </Button>
        </Card>
        <Box css={{ gap: 16 }}>
          {AppMeta.map(({ label, value }) => (
            <MetaField key={label} label={label} value={value} />
          ))}
        </Box>
        <Box>
          <Button variant="link">Terms of Service</Button>
          <Button variant="link">Privacy Policy</Button>
        </Box>
      </Box>
    </AppLayout>
  )
}
