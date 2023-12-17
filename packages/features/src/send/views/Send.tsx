import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { SendForm } from '../components/SendForm'

export const SendView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Send"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 p-4">
          <SendForm />
        </div>
      </div>
    </AppLayout>
  )
}
