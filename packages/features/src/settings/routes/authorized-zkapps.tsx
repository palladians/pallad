import { useEffect, useState } from "react"

import { fetcher } from "@/common/lib/fetch"
import { useNavigate } from "react-router-dom"
import { AuthorizedZkAppsView } from "../views/authorized-zkapps"

export type ZkApp = {
  title: string
  description: string
  image: string
  url: string
}
export const AuthorizedZkAppsRoute = () => {
  const navigate = useNavigate()
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
    <AuthorizedZkAppsView
      handleDeleteApp={handleDeleteApp}
      apps={connectedApps}
      onCloseClicked={() => navigate(-1)}
    />
  )
}
