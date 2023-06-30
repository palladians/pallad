import { Box, Button, Card, Text } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'

export const AddressBookView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', flex: 1, gap: 16 }}>
        <ViewHeading
          title="Address Book"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box>
          <Card
            css={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              padding: '$md'
            }}
          >
            <Text>Bruce Wayne</Text>
            <Text>B62Xfg...fof34</Text>
          </Card>
          <Button variant="link" onPress={() => navigate('/contacts/new')}>
            Add New Address
          </Button>
        </Box>
      </Box>
    </AppLayout>
  )
}
