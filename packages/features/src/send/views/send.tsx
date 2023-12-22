import { useNavigate } from 'react-router-dom'

import { AppLayout } from '@/components/app-layout'
import { ViewHeading } from '@/components/view-heading'

import { SendForm } from '../components/send-form'

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
