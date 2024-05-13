import { useNavigate } from "react-router-dom"

import { TermsOfUseView } from "../views/terms-of-use"

export const TermsOfUseRoute = () => {
  const navigate = useNavigate()
  return <TermsOfUseView onCloseClicked={() => navigate(-1)} />
}
