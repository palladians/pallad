import { useNavigate } from "react-router-dom"

import { DisplayView } from "../views/display"

export const DisplayRoute = () => {
  const navigate = useNavigate()
  return <DisplayView onCloseClicked={() => navigate(-1)} />
}
