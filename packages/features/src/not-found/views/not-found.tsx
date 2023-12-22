import { useNavigate } from 'react-router-dom'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { ViewHeading } from '@/components/view-heading'

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
