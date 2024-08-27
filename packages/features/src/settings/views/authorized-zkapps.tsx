import { useEffect, useState } from "react"

import { fetcher } from "@/common/lib/fetch"
import { AppLayout } from "@/components/app-layout"
import { SettingsPageLayout } from "@/components/settings-page-layout"
import { X } from "lucide-react"

type AuthorizedZkAppsViewProps = {
  onCloseClicked: () => void
}

type ZkApp = { title: string; description: string; image: string; url: string }

export const AuthorizedZkAppsView = ({
  onCloseClicked,
}: AuthorizedZkAppsViewProps) => {
  const [connectedApps, setConnectedApps] = useState([] as ZkApp[])

  useEffect(() => {
    fetchConnectedApps()
  }, [])

  const fetchConnectedApps = async () => {
    const { permissions } = (await chrome.storage.local.get({
      permissions: [],
    })) as Record<string, "ALLOWED">
    // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    const URLRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    const appsWithMetadata = await Promise.all(
      Object.keys(permissions)
        .filter((key) => URLRegex.test(key))
        .map(async (url) => {
          const metadata = (await fetcher(
            `https://api.dub.co/metatags?url=${url}`,
          )) as Omit<ZkApp, "url">
          return { url, ...metadata }
        }),
    )
    setConnectedApps(appsWithMetadata)
  }

  const handleDeleteApp = async (appToDelete: ZkApp) => {
    const filteredApps = connectedApps.filter(
      (app) => app.url !== appToDelete.url,
    )
    await chrome.storage.local.set({ permissions: filteredApps })
    setConnectedApps(filteredApps)
  }

  return (
    <AppLayout>
      <SettingsPageLayout
        title="Authorized zkApps"
        onCloseClicked={onCloseClicked}
      >
        {connectedApps.map((app) => (
          <div
            key={app.url}
            className="p-4 flex items-center justify-between bg-secondary rounded-2xl"
          >
            <div className="flex gap-3">
              <img
                src={app.image}
                alt={app.title}
                className="w-8 h-8 pt-1 rounded"
              />
              <div>
                <p>{app.title}</p>
                <p className="text-sm">{app.url}</p>
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
