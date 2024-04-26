import { useNavigate } from "react-router-dom"

import { DelegateView } from "../views/delegate"

export const DelegateRoute = () => {
  const navigate = useNavigate()
  return <DelegateView onGoBack={() => navigate(-1)} />
}
