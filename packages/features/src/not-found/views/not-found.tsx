import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"

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
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <div className="flex flex-col flex-1 gap-4 p-4">
        <div className="flex flex-1 justify-center items-center">
          <div>Sorry, but we couldn't find this page</div>
        </div>
        <button type="button" onClick={onGoToDashboard}>
          Go to Dashboard
        </button>
      </div>
    </AppLayout>
  )
}
