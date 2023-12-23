import { useNavigate } from 'react-router-dom'

import { AppLayout } from '@/components/app-layout'
import { ViewHeading } from '@/components/view-heading'

import { NewAddressForm } from '../components/new-address-form'

export const NewAddressView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="New Address"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 p-4">
          <NewAddressForm />
        </div>
      </div>
    </AppLayout>
  )
}
