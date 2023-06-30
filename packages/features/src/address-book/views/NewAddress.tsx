import { Box, Button, Input } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

export const NewAddressView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', flex: 1, gap: 24 }}>
        <ViewHeading
          title="New Address"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ flex: 1, gap: 16 }}>
          <Box css={{ gap: 8 }}>
            <FormLabel>Contact's Name</FormLabel>
            <Input placeholder="Name" autoFocus />
          </Box>
          <Box css={{ gap: 8 }}>
            <FormLabel>Receiver Address</FormLabel>
            <Input placeholder="B62XXXXXXXXXXXX" />
          </Box>
        </Box>
        <Button>Create Contact</Button>
      </Box>
    </AppLayout>
  )
}
