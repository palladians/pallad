import { useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"
import { useFiatPrice } from "@palladxyz/offchain-data"
import { useVault } from "@palladxyz/vault"
import { useState } from "react"
import { SendView } from "../views/send"

export const SendRoute = () => {
  const [advanced, setAdvanced] = useState(false)
  const navigate = useNavigate()
  const { data: accountProperties } = useAccount()
  const { current: rawFiatPrice } = useFiatPrice()
  const currentNetworkName = useVault((state) => state.currentNetworkName)
  return (
    <SendView
      onGoBack={() => navigate(-1)}
      balance={accountProperties?.balance ?? 0}
      fiatPrice={rawFiatPrice}
      advanced={advanced}
      setAdvanced={setAdvanced}
      currentNetwork={currentNetworkName}
    />
  )
}
