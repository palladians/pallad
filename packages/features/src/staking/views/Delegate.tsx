import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { DelegateForm } from '../components/DelegateForm'

export const DelegateView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col gap-4 flex-1">
        <ViewHeading
          title="Delegate"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <DelegateForm />
      </div>
    </AppLayout>
  )
}
