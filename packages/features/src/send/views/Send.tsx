import { Box } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { SendForm } from '../components/SendForm'

export const SendView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16, flex: 1 }}>
        <ViewHeading
          title="Send"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <SendForm />
      </Box>
    </AppLayout>
  )
}
