import { useNavigate } from "react-router-dom"
import { PrivacyView } from "../views/privacy"

export const PrivacyRoute = () => {
  const navigate = useNavigate()
  return <PrivacyView onCloseClicked={() => navigate(-1)} />
}
