import { Button } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

import { ViewHeading } from '../../common/components/ViewHeading'

export const NotFoundView = () => {
  const navigate = useNavigate()
  return (
    <div className="flex-1 padding-4">
      <ViewHeading
        title="Not Found"
        backButton={{ onClick: () => navigate(-1) }}
      />
      <div className="flex-1 justify-center items-center">
        Sorry, but we couldn't find this page
      </div>
      <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
    </div>
  )
}
