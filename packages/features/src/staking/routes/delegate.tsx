import { useNavigate } from "react-router-dom"

import { useState } from "react"
import { DelegateView } from "../views/delegate"

export const DelegateRoute = () => {
  const [advanced, setAdvanced] = useState(false)
  const navigate = useNavigate()
  return (
    <DelegateView
      onGoBack={() => navigate(-1)}
      advanced={advanced}
      setAdvanced={setAdvanced}
    />
  )
}
