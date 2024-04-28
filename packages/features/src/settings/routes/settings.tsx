import { useTheme } from "next-themes"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAppStore } from "@/common/store/app"

import { SettingsView } from "../views/settings"

export const SettingsRoute = () => {
  const [restartAlertVisible, setRestartAlertVisible] = useState(false)
  const navigate = useNavigate()
  // const switchNetwork = useVault((state) => state.switchNetwork)
  const { setTheme, theme } = useTheme()
  // const { mutate } = useSWRConfig()
  const { network, shareData, setShareData } = useAppStore((state) => ({
    setNetwork: state.setNetwork,
    network: state.network,
    shareData: state.shareData,
    setShareData: state.setShareData,
  }))
  // const handleNetworkSwitch = async (value: Mina.Networks) => {
  //   await switchNetwork(value)
  //   await mutate(() => true, undefined, { revalidate: false })
  //   toast({
  //     title: `Network has been changed to ${
  //       Mina.Networks[value.toUpperCase() as keyof typeof Mina.Networks]
  //     }`
  //   })
  // }
  const handleThemeSwitch = (value: string) => {
    setTheme(value)
    // toast({
    //   title: "Theme has been changed.",
    // });
  }
  return (
    <SettingsView
      network={network}
      onGoBack={() => navigate(-1)}
      restartAlertVisible={restartAlertVisible}
      setRestartAlertVisible={setRestartAlertVisible}
      setShareData={setShareData}
      shareData={shareData}
      theme={theme ?? "dark"}
      setTheme={handleThemeSwitch}
    />
  )
}
