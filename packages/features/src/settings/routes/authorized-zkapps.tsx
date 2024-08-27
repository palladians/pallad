import { useNavigate } from "react-router-dom"
import { AuthorizedZkAppsView } from "../views/authorized-zkapps"

export const AuthorizedZkAppsRoute = () => {
  const navigate = useNavigate()

  return <AuthorizedZkAppsView onCloseClicked={() => navigate(-1)} />
}
