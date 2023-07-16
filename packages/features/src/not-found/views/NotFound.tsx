import { Button } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

import { ViewHeading } from '../../common/components/ViewHeading'
import { AppLayout } from '../../common/components/AppLayout'

export const NotFoundView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Not Found"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-1 justify-center items-center">
          <div>Sorry, but we couldn't find this page</div>
        </div>
        <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
      </div>
    </AppLayout>
  )
}
