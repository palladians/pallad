import { useNavigate } from "react-router-dom"
import { SettingsView } from "../views/settings"

export const SettingsRoute = () => {
  const navigate = useNavigate()
  const onDonateClicked = () => {
    navigate("/send", {
      state: {
        address: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
      },
    })
  }
  return (
    <SettingsView
      onCloseClicked={() => navigate(-1)}
      onDonateClicked={onDonateClicked}
    />
  )
}
