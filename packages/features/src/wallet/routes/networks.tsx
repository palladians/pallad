import { useAccount } from "@/common/hooks/use-account"
import { useVault } from "@palladxyz/vault"
import { useNavigate } from "react-router-dom"
import { sendMessage } from "webext-bridge/popup"
import { NetworksView } from "../views/networks"

export const NetworksRoute = () => {
  const navigate = useNavigate()
  const currentNetworkName = useVault((state) => state.currentNetworkName)
  const { fetchWallet } = useAccount()
  const onNetworkSwitch = async (network: string) => {
    await sendMessage("pallad_switchNetwork", { network })
    await useVault.persist.rehydrate()
    await fetchWallet()
    navigate("/dashboard")
  }
  return (
    <NetworksView
      onCloseClicked={() => navigate(-1)}
      onNetworkSwitch={onNetworkSwitch}
      currentNetwork={currentNetworkName}
    />
  )
}
