import { AppLayout } from '@/components/app-layout'
import { ViewHeading } from '@/components/view-heading'

import { DelegateForm } from '../components/delegate-form'

type DelegateViewProps = {
  onGoBack: () => void
}

export const DelegateView = ({ onGoBack }: DelegateViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading title="Delegate" backButton={{ onClick: onGoBack }} />
        <div className="flex flex-1 flex-col p-4 gap-4">
          <DelegateForm />
        </div>
      </div>
    </AppLayout>
  )
}
