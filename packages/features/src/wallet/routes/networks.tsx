import { useVault } from "@palladxyz/vault"
import { useNavigate } from "react-router-dom"
import { NetworksView } from "../views/networks"

export const NetworksRoute = () => {
  const navigate = useNavigate()
  const switchNetwork = useVault((state) => state.switchNetwork)
  const _syncWallet = useVault((state) => state._syncWallet)
  const onNetworkSwitch = async (network: string) => {
    await switchNetwork(network)
    await _syncWallet()
    navigate("/dashboard")
  }
  return (
    <NetworksView
      onCloseClicked={() => navigate(-1)}
      onNetworkSwitch={onNetworkSwitch}
    />
  )
}
