import { useAccount } from "@/common/hooks/use-account"
import { useNavigate } from "react-router-dom"
import { SettingsView } from "../views/settings"

export const SettingsRoute = () => {
  const navigate = useNavigate()
  const { lockWallet } = useAccount()
  const onDonateClicked = () => {
    navigate("/send", {
      state: {
        address: "B62qnVUL6A53E4ZaGd3qbTr6RCtEZYTu3kTijVrrquNpPo4d3MuJ3nb",
      },
    })
  }
  return (
    <SettingsView
      onCloseClicked={() => navigate(-1)}
      onDonateClicked={onDonateClicked}
      onLogOut={lockWallet}
    />
  )
}
