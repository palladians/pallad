import { useVault } from "@palladxyz/vault"
import { useNavigate } from "react-router-dom"
import { NetworksView } from "../views/networks"

export const NetworksRoute = () => {
  const navigate = useNavigate()
  const switchNetwork = useVault((state) => state.switchNetwork)
  const onNetworkSwitch = async (network: string) => {
    await switchNetwork(network)
    navigate("/dashboard")
  }
  return (
    <NetworksView
      onCloseClicked={() => navigate(-1)}
      onNetworkSwitch={onNetworkSwitch}
    />
  )
}
