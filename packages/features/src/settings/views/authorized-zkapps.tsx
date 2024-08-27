import { AppWindowMac, X } from "lucide-react"

import { truncateString } from "@/common/lib/string"
import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import type { ZkApp } from "../routes/authorized-zkapps"

type AuthorizedZkAppsViewProps = {
  onCloseClicked: () => void
  apps: ZkApp[]
  handleDeleteApp: (appToDelete: ZkApp) => void
}

export const AuthorizedZkAppsView = ({
  onCloseClicked,
  handleDeleteApp,
  apps: connectedApps,
}: AuthorizedZkAppsViewProps) => {
  return (
    <AppLayout>
      <SettingsPageLayout
        title="Authorized zkApps"
        onCloseClicked={onCloseClicked}
      >
        {connectedApps.map((app) => (
          <div
            key={app.url}
            className="p-4 flex items-center justify-between bg-secondary rounded-2xl mb-4"
          >
            <div className="flex gap-3">
              {app.image ? (
                <img
                  src={app.image}
                  alt={app.title}
                  className="w-8 h-8 pt-1 rounded"
                />
              ) : (
                <div className="pt-1 w-8 h-8 rounded">
                  <AppWindowMac size={32} />
                </div>
              )}
              <div>
                <p>
                  {truncateString({
                    value: app.title,
                    firstCharCount: 20,
                    endCharCount: 2,
                  })}
                </p>
                <p className="text-sm">
                  {truncateString({
                    value: app.url,
                    firstCharCount: 20,
                    endCharCount: 2,
                  })}
                </p>
              </div>
            </div>
            <div>
              <button type="button" onClick={() => handleDeleteApp(app)}>
                <X />
              </button>
            </div>
          </div>
        ))}
      </SettingsPageLayout>
    </AppLayout>
  )
}
