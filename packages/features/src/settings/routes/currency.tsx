import { useNavigate } from "react-router-dom"
import { CurrencyView } from "../views/currency"

export const CurrencyRoute = () => {
  const navigate = useNavigate()
  return <CurrencyView onCloseClicked={() => navigate(-1)} />
}
