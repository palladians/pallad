import { Box, Button, Text } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { ViewHeading } from '../../common/components/ViewHeading'

export const NotFoundView = () => {
  const navigate = useNavigate()
  return (
    <Box
      css={{
        flex: 1,
        padding: '$md'
      }}
    >
      <ViewHeading
        title="Not Found"
        backButton={{ onPress: () => navigate(-1) }}
      />
      <Box css={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Sorry, but we couldn't find this page.</Text>
      </Box>
      <Button onPress={() => navigate('/')}>Go to Dashboard</Button>
    </Box>
  )
}
