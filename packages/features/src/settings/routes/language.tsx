import { useNavigate } from "react-router-dom"
import { LanguageView } from "../views/language"

export const LanguageRoute = () => {
  const navigate = useNavigate()
  return <LanguageView onCloseClicked={() => navigate(-1)} />
}
