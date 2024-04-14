import { AppLayout } from '@/components/app-layout'
import { ViewHeading } from '@/components/view-heading'

import { NewAddressForm } from '../components/new-address-form'

type NewAddressViewProps = {
  onGoBack: () => void
}

export const NewAddressView = ({ onGoBack }: NewAddressViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading title="New Address" backButton={{ onClick: onGoBack }} />
        <div className="flex flex-col flex-1 p-4">
          <NewAddressForm />
        </div>
      </div>
    </AppLayout>
  )
}
