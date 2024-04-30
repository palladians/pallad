import { useNavigate } from "react-router-dom"

import { AboutView } from "../views/about"

export const AboutRoute = () => {
  const navigate = useNavigate()
  return <AboutView onCloseClicked={() => navigate(-1)} />
}
