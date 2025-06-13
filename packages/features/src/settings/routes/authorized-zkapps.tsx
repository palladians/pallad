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

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const URLRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

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
    const appsWithMetadata = await Promise.all(
      Object.keys(permissions)
        .filter((key) => URLRegex.test(key))
        .map(async (url) => {
          let metadata: Omit<ZkApp, "url"> = {
            title: "",
            description: "",
            image: "",
          }
          try {
            metadata = await fetcher(`https://api.dub.co/metatags?url=${url}`)
          } catch (e) {}
          return { url, ...metadata }
        }),
    )
    setConnectedApps(appsWithMetadata)
  }

  const handleDeleteApp = async (appToDelete: ZkApp) => {
    const filteredApps = connectedApps.filter(
      (app) => app.url !== appToDelete.url,
    )

    const { permissions } = await chrome.storage.local.get({
      permissions: {} as ZkApp[] & Record<string, "ALLOWED">,
    })
    const newPermissions = Object.assign({}, filteredApps) as ZkApp[] &
      Record<string, "ALLOWED">
    for (const k of Object.keys(permissions).filter(
      (key) => URLRegex.test(key) && key !== appToDelete.url,
    )) {
      newPermissions[k] = permissions[k]
    }
    await chrome.storage.local.set({ permissions: newPermissions })

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
