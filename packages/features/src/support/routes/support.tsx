import { useNavigate } from "react-router-dom"

import { SupportView } from "../views/support"

export const SupportRoute = () => {
  const navigate = useNavigate()
  return <SupportView onCloseClicked={() => navigate(-1)} />
}
