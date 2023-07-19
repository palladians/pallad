import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { NewAddressForm } from '../components/NewAddressForm'

export const NewAddressView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-6">
        <ViewHeading
          title="New Address"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <NewAddressForm />
      </div>
    </AppLayout>
  )
}
