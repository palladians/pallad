import { useAccount } from "@/common/hooks/use-account"
import { useVault } from "@palladco/vault"
import { useNavigate } from "react-router-dom"
import { sendMessage } from "webext-bridge/popup"
import { NetworksView } from "../views/networks"

export const NetworksRoute = () => {
  const navigate = useNavigate()
  const networkId = useVault((state) => state.currentNetworkId)
  const { fetchWallet } = useAccount()
  const onNetworkSwitch = async (networkId: string) => {
    await sendMessage("pallad_switchNetwork", { networkId })
    await useVault.persist.rehydrate()
    await fetchWallet()
    navigate("/dashboard")
  }
  return (
    <NetworksView
      onCloseClicked={() => navigate(-1)}
      onNetworkSwitch={onNetworkSwitch}
      networkId={networkId}
    />
  )
}
