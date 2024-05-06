import { useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"
import { useFiatPrice } from "@palladxyz/offchain-data"
import { useState } from "react"
import { SendView } from "../views/send"

export const SendRoute = () => {
  const [advanced, setAdvanced] = useState(false)
  const navigate = useNavigate()
  const { data: accountProperties } = useAccount()
  const { data: fiatPrice } = useFiatPrice()
  return (
    <SendView
      onGoBack={() => navigate(-1)}
      balance={accountProperties?.balance ?? 0}
      fiatPrice={fiatPrice?.["mina-protocol"].usd ?? 0}
      advanced={advanced}
      setAdvanced={setAdvanced}
    />
  )
}
