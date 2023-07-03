import { Box } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { NewAddressForm } from '../components/NewAddressForm'

export const NewAddressView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', flex: 1, gap: 24 }}>
        <ViewHeading
          title="New Address"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <NewAddressForm />
      </Box>
    </AppLayout>
  )
}
