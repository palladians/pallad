import { Box } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { DelegateForm } from '../components/DelegateForm'

export const DelegateView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16, flex: 1 }}>
        <ViewHeading
          title="Delegate"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <DelegateForm />
      </Box>
    </AppLayout>
  )
}
