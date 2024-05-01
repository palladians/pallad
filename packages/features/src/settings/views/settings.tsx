import { AppLayout } from "@/components/app-layout"

type SettingsViewProps = {
  onGoBack: () => void
}

export const SettingsView = ({ onGoBack }: SettingsViewProps) => {
  return (
    <AppLayout>
      <p>Settings</p>
    </AppLayout>
  )
}
