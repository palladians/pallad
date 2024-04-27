import { AppLayout } from "@/components/app-layout"
import { ViewHeading } from "@/components/view-heading"

type NotFoundViewProps = {
  onGoToDashboard: () => void
  onGoBack: () => void
}

export const NotFoundView = ({
  onGoBack,
  onGoToDashboard,
}: NotFoundViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading title="Not Found" backButton={{ onClick: onGoBack }} />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <div className="flex flex-1 justify-center items-center">
            <div>Sorry, but we couldn't find this page</div>
          </div>
          <button type="button" onClick={onGoToDashboard}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
