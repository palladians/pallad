import { useNavigate } from 'react-router-dom'

import { AppLayout } from '@/components/app-layout'
import { ViewHeading } from '@/components/view-heading'

import { DelegateForm } from '../components/delegate-form'

export const DelegateView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Delegate"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-1 flex-col p-4 gap-4">
          <DelegateForm />
        </div>
      </div>
    </AppLayout>
  )
}
