import { useNavigate } from "react-router-dom"
import { NetworksView } from "../views/networks"

export const NetworksRoute = () => {
  const navigate = useNavigate()
  return <NetworksView onCloseClicked={() => navigate(-1)} />
}
