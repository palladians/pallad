import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"

type PrivacyViewProps = {
  onCloseClicked: () => void
}

export const PrivacyView = ({ onCloseClicked }: PrivacyViewProps) => {
  return (
    <AppLayout>
      <SettingsPageLayout title="Privacy" onCloseClicked={onCloseClicked}>
        <div className="pl-6 pr-4 py-4 flex items-center justify-between bg-secondary rounded-2xl">
          <div>
            <p>Share data</p>
            <p className="text-sm">Anonymous data only</p>
          </div>
          <input
            type="checkbox"
            className="toggle [--tglbg:#F6C177] bg-white hover:bg-white border-[#F6C177]"
          />
        </div>
      </SettingsPageLayout>
    </AppLayout>
  )
}
